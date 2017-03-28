import { Injectable } from '@angular/core';
@Injectable()
export class MakeOperation {
  opTree: any = {};
  stack: any  = [];
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
  pushStack(x) {
    this.stack.push(x);  
  }
  clearStack() {
    this.stack = [];  
  }
  getStack() {
    return this.stack;
  }
  
  isComplete() {
    return false;
  }
  
}
