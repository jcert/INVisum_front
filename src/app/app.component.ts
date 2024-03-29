import { Component, ViewChild } from '@angular/core';
import {Platform, Nav, Config} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Observable} from 'rxjs/Observable';
import { ApiTalker, Settings} from '../providers/providers';

import { FirstRunPage } from '../pages/pages';
import { InVisumWelcomePage } from '../pages/in-visum-welcome/in-visum-welcome';
import { InVisumFAQPage } from '../pages/in-visum-faq/in-visum-faq';
import { InVisumSearchPage } from '../pages/in-visum-search/in-visum-search';
import { InVisumLoginPage } from '../pages/in-visum-login/in-visum-login';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  template: `
  <ion-menu [content]="content">      
    <!--
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>
    -->
    <ion-content >
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button menuClose ion-item (click)="startingPage()">
          Home
        </button>
        <button menuClose ion-item (click)="logout()">
          Logout
        </button>
      </ion-list>
    </ion-content>
  </ion-menu>
  
  
  <ion-nav  #content [root]="rootPage">
    <ion-navbar>
      <ion-title>Login</ion-title>
    </ion-navbar>
  </ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;
  mustLogout: boolean = false;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Busca', component: InVisumSearchPage },
    { title: 'Historico', component: InVisumFAQPage },
    { title: 'Perfil', component: InVisumFAQPage }
  ]

  constructor(translate: TranslateService, platform: Platform, settings: Settings, config: Config, public apiTalk : ApiTalker) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
  logout() {
    this.nav.setRoot(InVisumLoginPage);
    Observable.timer(50).subscribe(() => {this.apiTalk.logout()});
  }
  is_logged() {
    return this.apiTalk.authenticated();
  }
  startingPage() {
    this.nav.setRoot(InVisumWelcomePage);
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
