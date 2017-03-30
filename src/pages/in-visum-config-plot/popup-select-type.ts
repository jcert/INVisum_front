import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PlotHelp } from '../../providers/providers';


@Component({
  selector: 'popup-select-type',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <button ion-item *ngFor="let i of list" (click)="close(i)">{{i}}</button>
    </ion-list>
  `
})
export class PopupSelectTypePage {
  title : string;
  field : string;
  list  : any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public pH: PlotHelp) {
    this.title = navParams.get('title');
    this.field = navParams.get('field');  
    this.list  = navParams.get('list');  
  }
  
  close(x) {
    this.pH.inputParam(this.field,x);
    this.viewCtrl.dismiss();  
  }

}

