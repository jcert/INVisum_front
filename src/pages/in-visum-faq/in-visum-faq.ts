
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

declare var Chart: any;

@Component({
  selector: 'page-in-visum-faq',
  templateUrl: 'in-visum-faq.html',
  
})

export class InVisumFAQPage {
  myChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  }
  
}

