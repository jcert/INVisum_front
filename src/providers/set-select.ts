import { Injectable } from '@angular/core';
@Injectable()
export class SetSelect {
  sets: any = [];
  constructor() {
  
  }
  add(item) { //make this add_unique
    if (-1 == this.sets.indexOf(item)) this.sets.push(item);
  }
  remove(item) {
    if (-1 != this.sets.indexOf(item)) this.sets.splice(this.sets.indexOf(item),1);
  }
  remove_all() {
    delete this.sets;
    this.sets = [];
  }
  get() {
    return this.sets;
  }
  exist(item){
    return (-1 != this.sets.indexOf(item));
  }
  size() {
    return this.sets.length;
  }
}
