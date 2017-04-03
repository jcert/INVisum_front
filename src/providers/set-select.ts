import { Injectable } from '@angular/core';
@Injectable()
export class SetSelect {
  sets: any = [];
  constructor() {
  
  }
  add(item) { //make this add_unique
    
    
    if ( this.sets.findIndex(x => x.id==item.id) ) this.sets.push(item);
  }
  remove(item) {
    if ( this.sets.findIndex(x => x.id==item.id) ) this.sets.splice(this.sets.indexOf(item),1);
  }
  remove_all() {
    this.sets = [];
  }
  get() {
    return this.sets;
  }
  exist(item){
    return (-1 != this.sets.findIndex(x => x.id==item.id));
  }
  size() {
    return this.sets.length;
  }
}
