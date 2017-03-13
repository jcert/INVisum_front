import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { FakeItems } from '../../providers/providers';
import { InVisumSearchResultPage } from '../in-visum-search-result/in-visum-search-result';
import { Item } from '../../models/item';

@Component({
  selector: 'page-in-visum-search',
  templateUrl: 'in-visum-search.html'
})
export class InVisumSearchPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems) {}

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
    this.currentItems = this.items.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(InVisumSearchResultPage, {
      item: item
    });
  }

}
