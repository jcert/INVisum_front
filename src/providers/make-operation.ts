import { Injectable } from '@angular/core';
@Injectable()
export class MakeOperation {
  opTree: any = {};
  stack: any  = [];
  opList: any = {
    Slice  : {chosenName : 'Slice',  args : [['set',  "sFset", 'funcTrue' ] ,['cond', 'sFslice', 'funcTrue' ],['condExp', 'inputNumber', 'funcTrue' ]]},//left,right,step
    Sort   : {chosenName : 'Sort',   args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['cond', 'sFsort', 'funcTrue' ],['condExp', 'inputNumber', 'funcTrue' ]]},//
    Filter : {chosenName : 'Filter', args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['expr', 'inputNumber', 'funcTrue' ]]},//
    Merge  : {chosenName : 'Merge',  args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ]]},
    Join   : {chosenName : 'Join',   args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ],['col1', 'sFcol', 'funcHasSet1' ],['col2', 'sFcol', 'funcHasSet2' ]]}
  }
  opKeys: any = Object.keys(this.opList);
  standardName : string = "operação";
  
  getOpList() {
    return this.opList;
  }
  constructor() {
  
  }
  insert(label,field) {
    this.opTree[label] = field; 
  }
  get() {
    return this.opTree;
  }
  clear() {
    this.opTree = {};
  }
  has(label) {
    return !(this.opTree[label] == null) ;
  }
  pushStack() {
    console.log(this.stack);
    this.stack.push(this.opTree);
    this.opTree = {};  
  }
  clearStack() {
    this.stack = [];  
  }
  getStack() {
    return this.stack;
  }
  
  isComplete() {
    let result: boolean = true;
    if(this.has(this.standardName)) {
      for(let i of this.opList[this.opTree[this.standardName]].args) {
        result = result && this.has(i[0]);
      }
    }
    return result;
  }
  
}
