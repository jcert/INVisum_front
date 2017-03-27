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
      Slice  : {chosenName : 'Slice',  args : [['set',  "sFset", true ] ,['cond', 'sFcond', true ],['condExp', 'getNumber', true ]]},//left,right,step
      Sort   : {chosenName : 'Sort',   args : [['set',  "sFset", true ] ,['col' , 'sFcol', true ],['cond', 'sFcond', true ],['condExp', (x) => {}, true ]]},//
      Filter : {chosenName : 'Filter', args : [['set',  "sFset", true ] ,['col' , 'sFcol', true ],['expr', (x) => {}, true ]]},//
      Merge  : {chosenName : 'Merge',  args : [['set1', "sFset", true ],['set2', "sFset", true ]]},
      Join   : {chosenName : 'Join',   args : [['set1', "sFset", true ],['set2', "sFset", true ],['col1', 'sFcol', true ],['col2', 'sFcol', true ]]}
    }
  opKeys: any = Object.keys(this.opList);
  
  standardName : string = "operação";
  chosen : boolean = false;
  command : any = {op:null,args:{}};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems, 
              public api: ApiTalker, public sets: SetSelect, public actionSheetCtrl: ActionSheetController) {
  }
  
  getCol(item?:Dataset){
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];//should return the columns of a given dataset
  }
  
  functionThatUsesThis(reg:string,op:any) {
    this[op](reg);
  }
  
  sFcol(colField:string) { //select from column
    let conditions : any = this.getCol();
    let makeActionSelectSet = (name:string, field:string) => {
      return {text: name,
              handler: () => {this.command.args[field]=name}
              };
    };
    let result: any = [];
    
    for(let c of conditions) {
      result.push(makeActionSelectSet(c,colField));  
    }
    result.push({text: 'Cancelar',role: 'cancel',handler: () => {}});      
    
    let actionSheet = this.actionSheetCtrl.create({
      title: colField,
      buttons: result
    });
    actionSheet.present();
  }
  
  
  sFcond(condField:string) { //select from condition
    let conditions : any = ['igual','diferente','maior','menor'];
    let makeActionSelectSet = (name:string, field:string) => {
      return {text: name,
              handler: () => {this.command.args[field]=name}
              };
    };
    let result: any = [];
    
    for(let c of conditions) {
      result.push(makeActionSelectSet(c,condField));  
    }
    result.push({text: 'Cancelar',role: 'cancel',handler: () => {}});      
    
    let actionSheet = this.actionSheetCtrl.create({
      title: condField,
      buttons: result
    });
    actionSheet.present();
  }
  
  sFset(setField:string) { //funtion to select from sets
    let makeActionSelectSet = (name:string, field:string) => {
      return {text: name,
              handler: () => {this.command.args[field]=name}
              };
    };
    let result: any = [];
    
    for(let set of this.sets.get()) {
      result.push(makeActionSelectSet(set.title,setField));  
    }
    result.push({text: 'Cancelar',role: 'cancel',handler: () => {}});      
    
    let actionSheet = this.actionSheetCtrl.create({
      title: setField,
      buttons: result
    });
    actionSheet.present();
  }

  
  makeActionSelectOp(name:string) {
    return {text: name,handler: () => {this.command.op=name}};
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
        {text: 'Cancelar',role: 'cancel',handler: () => {}}]});
    actionSheet.present();
  }


}
