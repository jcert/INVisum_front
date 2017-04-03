import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MakeOperation} from '../../providers/providers';


@Component({
  selector: 'popup-insert',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <ion-input [(ngModel)]="input" type="number" placeholder="Valor" autofocus value=""></ion-input>
      <button ion-button block (click)="close()" [ngStyle]="{'text-align': 'center'}"  >Usar</button>
    </ion-list>
  `
})
export class PopupInsertPage {
  title : string;
  input : string;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public mOp: MakeOperation) {
    this.title    = navParams.get('title');
  }

  close() {
    if (this.input ) this.mOp.insert(this.title,this.input);
    this.viewCtrl.dismiss();
  }
}

