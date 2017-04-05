import { Injectable } from '@angular/core';
import { ApiTalker } from './api-talker';
import { SetSelect } from './set-select';
import Rx from 'rxjs/Rx';


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
    Filter : {chosenName : 'Filter', args : [['set',  "sFset", 'funcTrue', ''] ,['items', 'inputString', 'funcTrue', '' ]]},//
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
    let observableArray : any = [];
    this.sourceDataList = {};
    
    for(let i of this.sets.get()) {
        observableArray.push(this.api.postComplete('datasets/personal/'+i.id+'/',{})); //
      }
    let kw  :any = Rx.Observable.concat(observableArray);
    let kww :any = [];
    
    
    this.api.getComplete('personal/')
      .map(x => x.json())
      .subscribe( 
      res => 
        {
          
          res.map(x => kww.push(this.api.deleteComplete('personal/'+x.id+'/')));
        }, 
      error => console.log('error'),
      () => {
              let kwwObser :any = Rx.Observable.concat(kww,kw);
              kwwObser.subscribe( r => {r.subscribe()}, e => console.log(e), () => {
                    Rx.Observable.timer(500).subscribe(
                      response => 
                        this.api.getComplete('personal/')
                            .map( resp => resp.json())
                            .subscribe( res => {personals = res; this.fillSourceList(personals,this.sets.get())}, 
                            error => console.log('error')
                            )
                      )
                    }    
               
              );
            }
      );                        
      
  }
  
  reset() {
  
  }
  
  fillSourceList(lP, lO) {
    let listPersonal = JSON.parse(JSON.stringify(lP));
    let listOriginal = JSON.parse(JSON.stringify(lO));
    let y: any = {};
    for(let i of listOriginal) {
      let x = i.id;
      delete i.id;
      y[x] = i;
    }
    this.clearStack();
    Rx.Observable.create( (observer) =>
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
    });
  }
  
  ngOnDestroy() {
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
        this.opObj.col1 = this.getHeaders(this.opObj.set1)[0]; 
        this.opObj.col2 = this.getHeaders(this.opObj.set2)[0];
      case('Join'):
        let x1: any = this.opObj.set1;
        let x2: any = this.opObj.set2;
        this.workingSet['t'+this.index] = {};
        for(let i of Object.keys(this.workingSet[x1])) {
          this.workingSet['t'+this.index][i] = (Array.isArray(this.workingSet[x1][i]))?this.workingSet[x1][i].concat(this.workingSet[x2][i]) :this.workingSet[x1][i]+this.workingSet[x2][i];
        }
        break;
      case('Filter'):
        this.workingSet['t'+this.index] = this.workingSet[this.opObj.set];
        this.workingSet['t'+this.index].headers = this.opObj.items;
        break;
      default:
        this.workingSet['t'+this.index] = this.workingSet[this.opObj.set]; 
    }
    this.opObj.target = 't'+this.index;//generated step
    this.stack.push(this.opObj);
    this.opObj = {};
    this.index++;  
  }
  getStack() {
    return this.stack;
  }
  StackCleaner() { //must return an observable to send the messages, errors and CONCLUSION TIME 
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
      /*
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
        
      }*/
      
      
      
      
      //finally, you must do all the operations before plotting
      //do op magic, remeber to wait for an op to be done to do another, and do substitute the tmp names when doing 2-set operations      
      let opToOpid = (z) => { let dict: any = {'Sort':6,'Filter':3,'Slice':1,'Merge':1,'Join':1}; return dict[z[this.standardName]]};
      let res: any = [];
    /*
      build the body for each request and make an array with just (type,(set|set1,set2),target) for easy use
    */ 
      for(let y of i) {
        let aux: any = {type:y[this.standardName],target:y.target}; 
        let body: any = {};
        
        switch(y[this.standardName]) { 
          case('Sort'):
            body = {by:y['col'],ascending:(y['ordem'] =='cresce')};
            aux.set = y.set;
          break;
          case('Filter'):
            body = {items:y['items']};
            aux.set = y.set;
          break;
          case('Slice'): 
            body[y.cond] = y.condExp;
            aux.set = y.set;
          break;
          case('Merge'):
          case('Join'):
            body = {left_on:y.col1, right_on:y.col1};
            aux.set1 = y.set1;
            aux.set2 = y.set2;
          break;
        }
        aux.body = body;
        res.push(aux);    
      }
      console.log(res);
    
    
              console.log('converter out',converter);
    /*
      make, send and get http
      y: all info you need -> operation, (set or set1,set2), target
    */
      let conv: any = {};
      let resolve : any = (id) => {if(id[0]=='t'){return conv[id]; }else{return id; }};
      let makeHTTP: any = (y,api) =>  Rx.Observable.create(function (observer) {
              let url: string;     
              let opToOpid = (z) => { let dict: any = {'Sort':6,'Filter':3,'Slice':1,'Merge':1,'Join':1}; return dict[z.type]};
              console.log('conv ',JSON.stringify(conv));
              switch(y.type) {
              case('Sort'): 
              case('Filter'): 
              case('Slice'):
                conv[y.target] = resolve(y.set); //changes take place on the same set 
                url = 'personal/operation/'+opToOpid(y)+'/'+resolve(y.set)+'/ ';              
              break;            
              case('Join'):
              case('Merge'):
                //will have to wait for the new id returning from the resquest
                url = 'personal/operation/'+opToOpid(y)+'/'+resolve(y.set1)+'-'+resolve(y.set2)+'/';
              break;
              }
              api.postComplete(url,y.body)
                  .subscribe( 
                  r  => { console.log('conv at the inner r',r);
                          let kk = JSON.parse(r.text() || "{}").id; if(kk) { conv[y.target] = kk; };
                          observer.next(r)}, 
                  e  => {observer.error(e)}, 
                  () => {observer.complete()})    
            });
      let auxiliar: any = [];      
      
      for(let y of res) {
        auxiliar.push(makeHTTP(y,this.api));      
      }
      
      let httpForObservable1 : any = Rx.Observable.concat(auxiliar); // note that an array is passed
      return httpForObservable1.concatAll();
      //.subscribe( res => res.subscribe( r => console.log('gooder doing',r),inErr => console.log('inner error doing',inErr), err => console.log('error doing',err)));
    /*
      res= [];
      
      for(let y of i) {
        if(y.set) {
          let body: any = {};
          switch(y[this.standardName]) { 
            case('Sort'):
              body = {by:y['col'],ascending:(y['ordem'] =='cresce')};
            break;
            case('Filter'):
              body = {items:y['items']};
            break;
            case('Slice'): 
              body[y.cond] = y.condExp;
            break;
          }  
          res.push(this.api.postComplete('personal/operation/'+opToOpid(y)+'/'+y.set+'/ ',body));
        }
        if(y.set1&&y.set2) {
          let body: any = {};
          switch(y[this.standardName]) {
            case('Merge'):
              body = {left_on:y.col1, right_on:y.col1};
            break;
            case('Join'):
              body = {left_on:y.col1, right_on:y.col1};
            break;
          }  
          res.push(this.api.postComplete('personal/operation/'+opToOpid(y)+'/'+y.set1+'-'+y.set2+'/',body));    
        }
      }
      let httpForObservable : any = Observable.concat(res); // note that an array is passed
   
      return httpForObservable;
    */
    }else{
      return Rx.Observable.empty();
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
