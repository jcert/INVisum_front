import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';


import { FakeItems, ApiTalker, SetSelect} from '../../providers/providers';
import { InVisumSearchResultPage } from '../in-visum-search-result/in-visum-search-result';
import { InVisumSearchListPage } from '../in-visum-search-list/in-visum-search-list';
import { Dataset } from '../../models/dataset';


@Component({
  selector: 'page-in-visum-operate',
  templateUrl: 'in-visum-operate.html'
})
export class InVisumOperatePage {
  currentItems: Dataset[] = [];
  errorString: string;
  opList: any = {
      Slice  : {chosenName : 'Slice',  args : [['set', null],['cond',null],['condExp',null]]},
      Sort   : {chosenName : 'Sort',   args : [['set', null],['col' ,null],['cond',null],['condExp',null]]},
      Filter : {chosenName : 'Filter', args : [['set', null],['col' ,null],['expr',null]]},
      Merge  : {chosenName : 'Merge',  args : [['set1',null],['set2',null]]},
      Join   : {chosenName : 'Join',   args : [['set1',null],['set2',null],['col1',null],['col2',null]]}
    }
  buttonOperation: any = {standardName: "operação", op : {}, chosen : false};
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems, 
              public api: ApiTalker, public set: SetSelect, public actionSheetCtrl: ActionSheetController) {
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Operações possíveis',
      buttons: [
        {
          text: 'Slice',
          handler: () => {
            console.log('Slice clicked');
            this.buttonOperation.op = this.opList.Slice;
            this.buttonOperation.chosen = true;
          }
        },{
          text: 'Sort',
          handler: () => {
            console.log('Sort clicked');
            this.buttonOperation.op = this.opList.Sort;
            this.buttonOperation.chosen = true;
          }
        },{
          text: 'Filter',
          handler: () => {
            console.log('Filter clicked');
            this.buttonOperation.op = this.opList.Filter;
            this.buttonOperation.chosen = true;
          }
        },{
          text: 'Merge',
          handler: () => {
            console.log('Merge clicked');
            this.buttonOperation.op = this.opList.Merge;
            this.buttonOperation.chosen = true;
          }
        },{
          text: 'Join',
          handler: () => {
            console.log('Join clicked');
            this.buttonOperation.op = this.opList.Join;
            this.buttonOperation.chosen = true;
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if(!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.api.query({name: val}).subscribe(
                                  resp  => {this.currentItems = resp;console.log(resp)},
                                  error => this.errorString =  <any> error
                                );
  
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Dataset) {
    this.navCtrl.push(InVisumSearchResultPage, {
      item: item
    });
  }
  
  workList() {
    this.navCtrl.push(InVisumSearchListPage);
  }
  

}
