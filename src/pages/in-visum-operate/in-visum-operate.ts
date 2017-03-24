import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';


import { FakeItems, ApiTalker, SetSelect} from '../../providers/providers';
import { Dataset } from '../../models/dataset';


@Component({
  selector: 'page-in-visum-operate',
  templateUrl: 'in-visum-operate.html'
})
export class InVisumOperatePage {
  currentItems: Dataset[] = [];
  errorString: string;
  opList: any = {
      Slice  : {chosenName : 'Slice',  args : [['set', null, "sFs" ] ,['cond',null, (x) => {} ],['condExp',null, (x) => {} ]]},
      Sort   : {chosenName : 'Sort',   args : [['set', null, "sFs" ] ,['col' ,null, (x) => {} ],['cond',null, (x) => {} ],['condExp',null, (x) => {} ]]},
      Filter : {chosenName : 'Filter', args : [['set', null, "sFs" ] ,['col' ,null, (x) => {} ],['expr',null, (x) => {} ]]},
      Merge  : {chosenName : 'Merge',  args : [['set1',null, "sFs" ],['set2',null, "sFs" ]]},
      Join   : {chosenName : 'Join',   args : [['set1',null, "sFs" ],['set2',null, "sFs" ],['col1',null, (x) => {} ],['col2',null, (x) => {} ]]}
    }
  standardName : string = "operação";
  chosen : boolean = false;
  command : any = {op:null,args:{}};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems, 
              public api: ApiTalker, public sets: SetSelect, public actionSheetCtrl: ActionSheetController) {
  }
  
  
  functionThatUsesThis(reg:string,op:any) {
    this[op](reg);
  }
  
  sFs(setField:string) { //funtion to select from sets
    let makeActionSelectSet = (name:string, field:string) => {
      return {text: name,
              handler: () => {console.log(name+' clicked');this.command.args[field]=name;console.log(this.command.args[setField])}
              };
    };
    let result: any = [];
    
    for(let set of this.sets.get()) {
      result.push(makeActionSelectSet(set.title,setField));  
    }
    result.push({text: 'Cancelar',role: 'cancel',handler: () => {console.log('Cancelar clicked');}});      
    
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Conjuntos',
      buttons: result
    });
    actionSheet.present();
  }

  
  makeActionSelectOp(name:string) {
    return {text: name,handler: () => {console.log(name+' clicked');this.command.op=name}};
  }
  
  presentActionSheet() {
    this.command = {op:null,args:{}};
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Operações possíveis',
      buttons: [
        this.makeActionSelectOp('Slice'),
        this.makeActionSelectOp('Sort'),
        this.makeActionSelectOp('Merge'),
        this.makeActionSelectOp('Filter'),
        this.makeActionSelectOp('Join'),
        {text: 'Cancelar',role: 'cancel',handler: () => {console.log('Cancelar clicked');}}]});
    actionSheet.present();
  }


}
