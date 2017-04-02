import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PlotHelp } from '../../providers/providers';


@Component({
  selector: 'popup-insert-type',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <ion-input [(ngModel)]="input" type="{{inputType}}" placeholder="Valor" value=""></ion-input>
      <button ion-button block (click)="close()">Usar</button>
    </ion-list>
  `
})
export class PopupInsertTypePage {
  input      : string;
  title      : string;
  field      : string;
  inputType  : any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public pH: PlotHelp) {
    this.title = navParams.get('title');
    this.field = navParams.get('field');  
    this.inputType  = navParams.get('inputType');  
  }
  
  close(x) {
    if (this.input ) this.pH.inputParam(this.field,this.input);
    this.viewCtrl.dismiss();  
  }

}

