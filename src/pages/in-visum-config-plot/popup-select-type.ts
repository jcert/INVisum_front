import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PlotHelp } from '../../providers/providers';


@Component({
  selector: 'popup-select-type',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <button ion-item *ngFor="let i of list" (click)="close(i)">{{nameFunct(i)}}</button>
    </ion-list>
  `
})
export class PopupSelectTypePage {
  title : string;
  field : string;
  list  : any;
  nameFunct : any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public pH: PlotHelp) {
    this.title = navParams.get('title');
    this.field = navParams.get('field');  
    this.list  = navParams.get('list');  
    let y: any = navParams.get('nameFunct');
    this.nameFunct = (y)?y: (x) => x;    
  }
  
  close(x) {
    this.pH.inputParam(this.field,x);
    this.viewCtrl.dismiss();  
  }

}

