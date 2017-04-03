import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { SetSelect, MakeOperation} from '../../providers/providers';
import { ApiTalker  } from '../../providers/api-talker';
import { PopupSelectPage } from './popup-select';
import { PopupInsertPage } from './popup-insert';
import { PopupStringPage } from './popup-string';
import { InVisumConfigPlotPage } from '../in-visum-config-plot/in-visum-config-plot';
import { Observable} from 'rxjs/Observable';


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
              public api: ApiTalker, public sets: SetSelect, 
              public popoverCtrl: PopoverController, public mOp: MakeOperation) {
  }
  
  ngOnInit() {
    this.mOp.clearAll();
    this.mOp.prepare();
  }
  
  ngOnDestroy() {
    this.mOp.clearAll();
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
    let y: any = this.mOp.getHeaders(this.mOp.getOp()['set'+x[1]]);
    //get in y the colums to the input set
    let conditions : any = y;
    this.listPopover(colField,conditions);
    
  }
  
  inputString(field:string) {
    this.stringPopover(field,this.mOp.getHeaders(this.mOp.getOp()['set']));
  }
  
  inputNumber(field:string) {
    this.numberPopover(field);
  }

  sFsort(condField:string) { //select for sort
    let conditions : any = ['decresce','cresce'];
    this.listPopover(condField,conditions);
  }
  
  sFslice(condField:string) { //select for slice
    let conditions : any = ['left','right','step'];
    this.listPopover(condField,conditions);
  }
  
  sFset(setField:string) { //funtion to select from sets
    this.listPopover(setField,this.mOp.getWorkingSetsKeys());
  }

  stringPopover(inTitle,inList) {
    let popover = this.popoverCtrl.create(PopupSelectPage,{title:inTitle,field:inTitle,list:inList,selectMany:true});
    popover.present();
  }

  numberPopover(inTitle) {
    let popover = this.popoverCtrl.create(PopupInsertPage,{title:inTitle});
    popover.present();
  }

  listPopover(inTitle,inList) {
    let popover = this.popoverCtrl.create(PopupSelectPage,{title:inTitle,field:inTitle,list:inList});
    popover.present();
  }
  
  goPlotConfig() {
    this.mOp
        .StackCleaner()
        .subscribe( res => res.subscribe( r => console.log('gooder doing',r),inErr => console.log('inner error doing',inErr)), 
                    err => console.log('error doing',err),
                     () => this.navCtrl.push(InVisumConfigPlotPage));
  }
  
  selectOp(inTitle,inList) {
    this.mOp.clear();
    this.listPopover(inTitle,inList);
  }
  


}
