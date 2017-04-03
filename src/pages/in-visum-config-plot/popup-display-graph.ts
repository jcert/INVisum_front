import { Component } from '@angular/core';
import {  DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PlotHelp } from '../../providers/providers';
import { ApiTalker  } from '../../providers/api-talker';


@Component({
  selector: 'page-popup-display-graph',
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Description
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <ion-icon name="md-close"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="card-background-page">
    <iframe [width]="size" [height]="size" [src]='graphURL()' >i frame failed</iframe>
  </ion-content>
  `
})
export class PopupDisplayGraphPage {
  id  : any = '';
  url : any;
  size: number = 10;
  graphId 
  constructor(public viewCtrl: ViewController, public api: ApiTalker, public dom : DomSanitizer, public navParams: NavParams) { 
    this.id = navParams.get('graphId');
    this.url = dom.bypassSecurityTrustResourceUrl('http://127.0.0.1:8000/personal/plot/'+this.id+'/');
    this.size = Math.min(window.innerHeight-40,window.innerWidth);//subtract the navbar
  }
  
  graphURL() {
    return this.url;
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

}

