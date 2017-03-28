import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MakeOperation} from '../../providers/providers';


@Component({
  selector: 'popup-select',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <button ion-item *ngFor="let i of keysList" (click)="close(i)">{{i}}</button>
    </ion-list>
  `
})
export class PopupSelectPage {
  title : string;
  inputObj : any;
  keysList : any;
  response : any = {};
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public mOp: MakeOperation) {
    this.title    = navParams.get('title');
    this.inputObj = navParams.get('list');
    this.keysList = (Array.isArray(this.inputObj))?this.inputObj:Object.keys(this.inputObj);
  }

  close(x:any) {
    this.mOp.insert(this.title,x);
    this.viewCtrl.dismiss();
  }
}

