import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-in-visum-search-result',
  templateUrl: 'in-visum-search-result.html'
})
export class InVisumSearchResultPage {
  item: any;
  _hasRating : any = false ;
  constructor(public navCtrl: NavController, navParams: NavParams) {
    
    this.item = navParams.get('item');
    console.log(this.item.rating);
  }
  
  getRating() {
    return Math.round(this.item.rating.average*5.0/100.0);
  }

}
