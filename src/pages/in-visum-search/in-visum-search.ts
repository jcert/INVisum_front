import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FakeItems, ApiTalker, SetSelect} from '../../providers/providers';
import { InVisumSearchResultPage } from '../in-visum-search-result/in-visum-search-result';
import { InVisumSearchListPage } from '../in-visum-search-list/in-visum-search-list';
import { InVisumOperatePage } from '../in-visum-operate/in-visum-operate';
import { Dataset } from '../../models/dataset';


@Component({
  selector: 'page-in-visum-search',
  templateUrl: 'in-visum-search.html'
})
export class InVisumSearchPage {
  currentItems: Dataset[] = [];
  errorString: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems, public api: ApiTalker, public set: SetSelect) {}

  shorten(x){ let max: any = 60; return (x.length > max)? x.substr(0, max-3)+"..." : x; }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if(!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.api.queryTitle({name: val}).subscribe(
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
  
  workList(){
    this.navCtrl.push(InVisumSearchListPage, {set: this.set});
  }
  
  operations() {
    if(this.currentItems.length>0) this.navCtrl.push(InVisumOperatePage);
  }

}
