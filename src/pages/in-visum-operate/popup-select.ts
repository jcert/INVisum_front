import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MakeOperation} from '../../providers/providers';


@Component({
  selector: 'popup-select',
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      
      <ion-item *ngFor="let i of keysListMultiple">
        <ion-label> {{ i }} </ion-label>
        <ion-toggle checked="false" (tap)="toggle(i)" ></ion-toggle>
      </ion-item>
      <button ion-item *ngIf="keysListMultiple.length>0" [ngStyle]="{'text-align': 'center'}"  (click)="closeMany()">Ok</button>
      
      <ion-item >
        <button ion-item *ngFor="let i of keysListOne" (tap)="closeOne(i)">{{i}}</button>
      </ion-item>
    </ion-list>
  `
})
export class PopupSelectPage {
  title   : string;
  field   : string;
  inputObj  : any;
  list      : any;
  selectMany: boolean;
  keysList  : any;
  keysListOne : any = [];
  keysListMultiple  : any = [];
  returnMultiples   : any = [];
  
  
  
  response : any = {};
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public mOp: MakeOperation) {
    this.title      = navParams.get('title');
    this.field      = navParams.get('field'); 
    this.list       = navParams.get('list');  
    this.selectMany = navParams.get('selectMany');
    this.keysList = (Array.isArray(this.list))?this.list:Object.keys(this.list);
    if(this.selectMany) {
      this.keysListMultiple = this.keysList;    
    }else{
      this.keysListOne = this.keysList;
    }
  }
  
  toggle(x) {
    if(this.returnMultiples.find( (k)=> k==x )) {
      this.returnMultiples.filter( (k)=> k!==x ); //  
    }else{
      this.returnMultiples.push(x);
    }  
  
  }

  closeOne(x:any) {
    this.mOp.insert(this.title,x);
    this.viewCtrl.dismiss();
  }
  closeMany() {
    this.mOp.insert(this.title,this.returnMultiples)
    this.viewCtrl.dismiss();
  }
}

