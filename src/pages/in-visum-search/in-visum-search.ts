import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { FakeItems, ApiTalker, SetSelect} from '../../providers/providers';
import { InVisumSearchResultPage } from '../in-visum-search-result/in-visum-search-result';
import { Dataset } from '../../models/dataset';


@Component({
  selector: 'page-in-visum-search',
  templateUrl: 'in-visum-search.html'
})
export class InVisumSearchPage {
  currentItems: Dataset[] = [];
  errorString: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems, public api: ApiTalker, public set: SetSelect) {}

  shorten(x){ let max: any = 30; return (x.length > max)? x.substr(0, 60)+"..." : x; }

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

}
