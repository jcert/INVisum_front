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
    Slice  : {chosenName : 'Slice',  args : [['set',  "sFset", 'funcTrue' ] ,['cond', 'sFslice', 'funcTrue' ],['condExp', 'inputNumber', 'funcTrue' ]]},//left,right,step
    Sort   : {chosenName : 'Sort',   args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['cond', 'sFsort', 'funcTrue' ]]},//
    Filter : {chosenName : 'Filter', args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['expr', 'inputNumber', 'funcTrue' ]]},//
    Merge  : {chosenName : 'Merge',  args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ]]},
    Join   : {chosenName : 'Join',   args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ],['col1', 'sFcol', 'funcHasSet1' ],['col2', 'sFcol', 'funcHasSet2' ]]}
  }
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
  has(label) {
    return !(this.opObj[label] == null) ;
  }
  pushStack() {
    console.log(this.stack);
    this.index++;
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
        console.log(this.workingSet['t'+this.index]);
        break;
      default:
        this.workingSet['t'+this.index] = this.workingSet[this.opObj.set]; 
    }
     
    this.stack.push(this.opObj);
    this.opObj = {};  
  }
  clearStack() {
    this.clear();
    this.stack = [];  
  }
  getStack() {
    return this.stack;
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
