import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { SetSelect} from '../../providers/providers';
import { ApiTalker  } from '../../providers/api-talker';
import { InVisumSearchResultPage } from '../in-visum-search-result/in-visum-search-result';
import { Dataset } from '../../models/dataset';


@Component({
  selector: 'in-visum-search-list',
  templateUrl: 'in-visum-search-list.html'
})
export class InVisumSearchListPage {
  currentItems: Dataset[] = [];
  errorString: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiTalker, public set: SetSelect) {
    //this.set = navParams.get('set');
    this.currentItems = set.get();
    
  }

  shorten(x){ let max: any = 60; return (x.length > max)? x.substr(0, max-3)+"..." : x; }

  /**
   * Perform a service for the proper items.
   */

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Dataset) {
    this.navCtrl.push(InVisumSearchResultPage, {
      item: item
    });
  }

}
