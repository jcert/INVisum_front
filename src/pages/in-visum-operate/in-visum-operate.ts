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
  
  
  opList: any = {
      Slice  : {chosenName : 'Slice',  args : [['set',  "sFset", 'funcTrue' ] ,['cond', 'sFcond', 'funcTrue' ],['condExp', 'inputNumber', 'funcTrue' ]]},//left,right,step
      Sort   : {chosenName : 'Sort',   args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['cond', 'sFcond', 'funcTrue' ],['condExp', 'inputNumber', 'funcTrue' ]]},//
      Filter : {chosenName : 'Filter', args : [['set',  "sFset", 'funcTrue' ] ,['col' , 'sFcol', 'funcHasSet' ],['expr', 'inputNumber', 'funcTrue' ]]},//
      Merge  : {chosenName : 'Merge',  args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ]]},
      Join   : {chosenName : 'Join',   args : [['set1', "sFset", 'funcTrue' ],['set2', "sFset", 'funcTrue' ],['col1', 'sFcol', 'funcHasSet1' ],['col2', 'sFcol', 'funcHasSet2' ]]}
    }
  opKeys: any = Object.keys(this.opList);
  
  standardName : string = "operação";
  chosen : boolean = false;
  command : any = {op:null,args:{}};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public items: FakeItems, public api: ApiTalker, public sets: SetSelect, 
              public actionSheetCtrl: ActionSheetController,  public popoverCtrl: PopoverController, public mOp: MakeOperation) {
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
  
  sFcond(condField:string) { //select from condition
    let conditions : any = ['igual','diferente','maior','menor'];
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
    //this.navCtrl.push(PopupSelectPage);
  }

  listPopover(inTitle,inList) {
    let popover = this.popoverCtrl.create(PopupSelectPage,{title:inTitle,list:inList});
    popover.present();
    console.log(this.mOp.get());
    //this.navCtrl.push(PopupSelectPage);
  }
  
  selectOp(inTitle,inList) {
    this.mOp.clear();
    this.listPopover(inTitle,inList);
  }
  


}
