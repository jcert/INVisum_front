import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';
import { FakeItems, ApiTalker, SetSelect, MakeOperation} from '../../providers/providers';
import { PopupSelectPage } from './popup-select';
import { PopupInsertPage } from './popup-insert';
import { InVisumPlotConfigPage } from '../in-visum-plot-config/in-visum-plot-config';


@Component({
  selector: 'page-in-visum-operate',
  templateUrl: 'in-visum-operate.html'
})
export class InVisumOperatePage {
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
  
  ngOnInit() {
    this.mOp.prepare();
  }
  
  pushCurrent() {
    if(this.mOp.isComplete()) {
      this.mOp.pushStack();
    }else{
      //give error or alert  
    }
  }
  
  functionThatUsesThis(x:any) {
    if(this[x[2]]())
    {
      this[x[1]](x[0]);
    } 
  }
  
  sFcol(colField:string) { //select from column
    let x = colField.match('col(\d?)');
    console.log('columns in id: ');
    console.log(this.mOp.getHeaders(this.mOp.getOp()['set'+x[1]]));
    let y: any = this.mOp.getHeaders(this.mOp.getOp()['set'+x[1]]);
    console.log('columns: ');
    console.log(y);
    //get in y the colums to the input set
    let conditions : any = y;
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
    this.listPopover(setField,this.mOp.getWorkingSetsKeys());
  }

  numberPopover(inTitle) {
    let popover = this.popoverCtrl.create(PopupInsertPage,{title:inTitle});
    popover.present();
  }

  listPopover(inTitle,inList) {
    let popover = this.popoverCtrl.create(PopupSelectPage,{title:inTitle,list:inList});
    popover.present();
  }
  
  selectOp(inTitle,inList) {
    this.mOp.clear();
    this.listPopover(inTitle,inList);
  }
  


}
