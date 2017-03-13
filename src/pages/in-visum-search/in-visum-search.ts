import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { FakeItems } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-in-visum-search',
  templateUrl: 'in-visum-search.html'
})
export class InVisumSearchPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public items: FakeItems) {}

  shorten(x){ return x; }

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
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

}
