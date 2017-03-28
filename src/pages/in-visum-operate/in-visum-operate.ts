import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';
import { FakeItems, ApiTalker, SetSelect, MakeOperation} from '../../providers/providers';
import { Dataset } from '../../models/dataset';
import { PopupSelectPage } from './popup-select';
import { PopupInsertPage } from './popup-insert';


@Component({
  selector: 'page-in-visum-operate',
  templateUrl: 'in-visum-operate.html'
})
export class InVisumOperatePage {
  currentItems: Dataset[] = [];
  errorString: string;
  
  funcTrue:    any = () => true;
  funcHasSet:  any = () => this.mOp.has('set');
  funcHasSet1: any = () => this.mOp.has('set1');
  funcHasSet2: any = () => this.mOp.has('set2');
  
  
  standardName : string = "operação";
  chosen : boolean = false;
  command : any = {op:null,args:{}};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public items: FakeItems, public api: ApiTalker, public sets: SetSelect, 
              public actionSheetCtrl: ActionSheetController,  public popoverCtrl: PopoverController, public mOp: MakeOperation) {
  }
  
  pushCurrent() {
    if(this.mOp.isComplete()) {
      this.mOp.pushStack();
    }else{
      //give error or alert  
    }
  }
  
  getCol(item?:Dataset){
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];//should return the columns of a given dataset
  }
  
  functionThatUsesThis(x:any) {
    console.log(this[x[2]]());
    if(this[x[2]]())
    {
      this[x[1]](x[0]);
    } 
  }
  
  sFcol(colField:string) { //select from column
    let conditions : any = this.getCol();
    this.listPopover(colField,conditions);
  }
  
  inputNumber(field:string) {
    this.numberPopover(field);
  }

  sFsort(condField:string) { //select for sort
    let conditions : any = ['maior','menor'];
    this.listPopover(condField,conditions);
  }
  
  sFslice(condField:string) { //select for slice
    let conditions : any = ['left','right','step'];
    this.listPopover(condField,conditions);
  }
  
  sFset(setField:string) { //funtion to select from sets
    let result: any = [];
    for(let set of this.sets.get().concat([])) {
      result.push(set.title);  
    }
    this.listPopover(setField,result);
  }

  numberPopover(inTitle) {
    let popover = this.popoverCtrl.create(PopupInsertPage,{title:inTitle});
    popover.present();
    console.log(this.mOp.get());
  }

  listPopover(inTitle,inList) {
    let popover = this.popoverCtrl.create(PopupSelectPage,{title:inTitle,list:inList});
    popover.present();
    console.log(this.mOp.get());
  }
  
  selectOp(inTitle,inList) {
    this.mOp.clear();
    this.listPopover(inTitle,inList);
  }
  


}
