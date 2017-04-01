import { Injectable } from '@angular/core';
import { ApiTalker } from './api-talker';
import { SetSelect } from './set-select';
import 'rxjs/add/operator/map';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class MakeOperation {
  opObj: any = {};
  stack: any  = [];
  workingSet: any = {};
  index: number = 0;
  sourceDataList: any;
  opList: any = {
  //operation_name : { }
    Slice  : {chosenName : 'Slice',  args : [['set',  "sFset", 'funcTrue', ''] ,['cond', 'sFslice', 'funcTrue', '?'],['condExp', 'inputNumber', 'funcTrue','?' ]]},//left,right,step
    Sort   : {chosenName : 'Sort',   args : [['set',  "sFset", 'funcTrue', ''] ,['col' , 'sFcol', 'funcHasSet', 'by' ],['ordem', 'sFsort', 'funcTrue','ascending' ]]},//
    Filter : {chosenName : 'Filter', args : [['set',  "sFset", 'funcTrue', ''] ,['regex', 'inputString', 'funcTrue', '' ]]},//
    Merge  : {chosenName : 'Merge',  args : [['set1', "sFset", 'funcTrue', '' ],['set2', "sFset", 'funcTrue', '']]},
    Join   : {chosenName : 'Join',   args : [['set1', "sFset", 'funcTrue', '' ],['set2', "sFset", 'funcTrue', '' ],['col1', 'sFcol', 'funcHasSet1', 'left_on' ],['col2', 'sFcol', 'funcHasSet2', 'right_on' ]]}
  }
  singleSetAPI: any = ['','Slice','Drop','Filter','Fillna','Dropna','Sort']; 
   multiSetAPI: any = ['','Merge','Closest Match Merge'];
  
  opKeys: any = Object.keys(this.opList);
  standardName : string = "operação";
  
  getOpList() {
    return this.opList;
  }
  constructor( public api: ApiTalker,  public sets: SetSelect ) {
  }
  
  prepare() {
    let personals: any = [];
    this.sourceDataList = {};
    this.api.getComplete('personal/')
      .map(x => x.json())
      .subscribe( res => 
        {
          res.map(x => {this.api.deleteComplete('personal/'+x.id+'/').subscribe(res => {})});
          for(let i of this.sets.get()) {
            this.api.postComplete('datasets/personal/'+i.id+'/',{}).subscribe( res => {}, error => console.log('error'));
          }
        }, 
      error => console.log('error')); 
    Observable.timer(500)
              .subscribe( x => this.api.getComplete('personal/')
              .map( resp => resp.json())
              .subscribe( res => {personals = res; this.fillSourceList(personals,this.sets.get())}, error => console.log('error')));
  }
  
  reset() {
  
  }
  
  fillSourceList(listPersonal, listOriginal) {
    let y: any = {};
    for(let i of listOriginal) {
      let x = i.id;
      delete i.id;
      y[x] = i;
    }
    this.clearStack();
    Observable.create( (observer) =>
      {
        for(let i of listPersonal) {//concurrency issues here
          let z = i.id;
          this.api.getComplete('personal/'+i.id+'/meta/').subscribe( x => {this.sourceDataList[z].headers = JSON.parse(x.json());} );
          delete i.id;
          this.sourceDataList[z] = i;
          this.sourceDataList[z].title = y[i.original].title;
        }
        observer.next({});
        observer.complete();
      }
    ).subscribe( res => 
    { 
      for(let i of Object.keys(this.sourceDataList)) {
        this.workingSet[i] = this.sourceDataList[i];  
      }  
      console.log('workingSet:');
      console.log(this.workingSet);
    });
  }
  
  ngOnDestroy() {
    console.log('operations destroyed');
  }
  
  insert(label,field) {
    this.opObj[label] = field; 
  }
  getOp() {
    return this.opObj;
  }
  getWorkingSetsKeys() {
    return Object.keys(this.workingSet);
  }
  getWorkingSets() {
    return this.workingSet;
  }
  getHeaders(set) {
    if(this.workingSet[set]) return this.workingSet[set].headers;
    return null;
  }
  clear() {
    this.opObj = {};
  }
  clearStack() {
    this.clear();
    this.stack = [];  
  }
  clearAll() {
    this.clear();
    this.index = 0;
    this.clearStack();
    this.workingSet = {};
  }
  has(label) {
    return !(this.opObj[label] == null) ;
  }
  pushStack() {
    switch(this.opObj[this.standardName]) {
      case('Merge'):
      case('Join'):
        console.log('Merge|Join');
        let x1: any = this.opObj.set1;
        let x2: any = this.opObj.set2;
        this.workingSet['t'+this.index] = {};
        for(let i of Object.keys(this.workingSet[x1])) {
          this.workingSet['t'+this.index][i] = (Array.isArray(this.workingSet[x1][i]))?this.workingSet[x1][i].concat(this.workingSet[x2][i]) :this.workingSet[x1][i]+this.workingSet[x2][i];
        }
        break;
      default:
        this.workingSet['t'+this.index] = this.workingSet[this.opObj.set]; 
    }
    
    this.stack.push(this.opObj);
    this.opObj = {};
    this.index++;  
  }
  getStack() {
    return this.stack;
  }
  StackCleaner() {
    //first you put in an array just the operations that lead to the very last one made
    let i: any = [];
    let f: any = 
      (index) => {
        let x: any = this.stack[index];
        x.index = index;
        i.push(x);
        if(x.set) {
          if(x.set[0]==='t') f(x.set.slice(1));//is it one of the personal sets (copies stright from searchables or saved after operations personal)
          return;
        };
        if(x.set1&&x.set2) {
          if(x.set1[0]==='t') f(x.set1.slice(1));
          if(x.set2[0]==='t') f(x.set2.slice(1));
          return;
        };
      };
    
    if(this.stack.length>0) {
      f(this.stack.length-1);      
      
     
      //then, you convert all the tmp names, i.e. t0, t23, t 50, to the personal dataset which must be operated 
      i = i.reverse();
      let converter: any = {};
      for(let y of i) {
        //substitute their tempSet for the actual one
        if(y.set) {
          if(y.set[0]==='t') { y.set = converter[y.set.slice(1)]}
          converter[y.index] = y.set;
        }
        if(y.set1&&y.set2) {
          if(y.set1[0]==='t') { y.set1 = converter[y.set1.slice(1)]; converter[y.index] = y.set1}
          if(y.set2[0]==='t') { y.set2 = converter[y.set2.slice(1)]; converter[y.index] = y.set2}
          converter[y.index] = y.index; //pass onward the temporary name, it will get a real one after the op request is done
        }
        
      }
      
      //finally, you must do all the operations before plotting
      //do op magic, remeber to wait for an op to be done to do another, and do substitute the tmp names when doing 2-set operations
      let res: any = [];
      let opToOpid = (z) => { let dict: any = {'Sort':6,'Filter':3,'Slice':1,'Merge':1,'Join':1}; return dict[z[this.standardName]]};
      
 
      for(let y of i) {
        console.log('go!!!, ',y);
        if(y.set) {
          let body: any = {};
          switch(y[this.standardName]) { 
            case('Sort'):
              body = {by:y['col'],ascending:(y['ordem'] =='cresce')};
            break;
            case('Filter'):
              body = {regex:".*"+y['regex']+".*"};
            break;
            case('Slice'): 
              body[y.cond] = y.condExp;
            break;
          }  
          res.push(this.api.postComplete('personal/operation/'+opToOpid(y)+'/'+y.set+'/ ',{}));
        }
        if(y.set1&&y.set2) {
          let body: any = {};
          switch(y[this.standardName]) {
            case('Merge'):
            case('Join'):
            body = {left_on:y.col1, right_on:y.col1};
            break;
          }  
          res.push(this.api.postComplete('personal/operation/'+opToOpid(y)+'/'+y.set1+'-'+y.set2+'/',{}));    
        }
      }
      let httpForObservable : any = Observable.concat(res); // note that array is passed
      httpForObservable.subscribe( res => res.subscribe( r => console.log('gooder doing',r),inErr => console.log('inner error doing',inErr)), err => console.log('error doing',err));
    } 
  }
  isComplete() {
    let result: boolean = true;
    if(this.has(this.standardName)) {
      for(let i of this.opList[this.opObj[this.standardName]].args) {
        result = result && this.has(i[0]);
      }
    }else{
      result = false;
    }
    return result;
  }
  
}
