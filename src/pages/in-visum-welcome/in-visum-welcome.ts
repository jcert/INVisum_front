
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { InVisumLoginPage } from '../in-visum-login/in-visum-login';
import { InVisumSearchPage } from '../in-visum-search/in-visum-search';
import { InVisumFAQPage } from '../in-visum-faq/in-visum-faq';
import { InVisumLegalPage } from '../in-visum-legal/in-visum-legal';
import { InVisumApiPage } from '../in-visum-api/in-visum-api';
import { InVisumProfilePage } from '../in-visum-profile/in-visum-profile';
import { Dataset } from '../../models/dataset';
import { ApiTalker } from '../../providers/api-talker';


/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-in-visum-welcome',
  templateUrl: 'in-visum-welcome.html'
})


export class InVisumWelcomePage {
  currentFeatured: Dataset[] = [];
  errorString: string;
  news : any[];
  silly_text : string;
  constructor(public navCtrl: NavController, public menu : MenuController, public apiTalk : ApiTalker) {
    //menu.enable(false);
  }
  
  ngOnInit() {
    if(this.is_logged()) {
      this.getItems();
    }  
  }
  
  getItems() {
    this.apiTalk.getFeatured().subscribe(
      resp  => {this.currentFeatured = resp, console.log(resp)},
      error => this.errorString =  <any> error
    );
  }                            

  login() {
    this.navCtrl.setRoot(InVisumLoginPage);
  }
  
  is_logged() {
    return this.apiTalk.authenticated();
  }
  
  logout() {
    this.apiTalk.logout();
    this.login();
  }

  historico() {
  
  }
  
  perfil() {
    this.navCtrl.push(InVisumProfilePage);
  }

  busca() {
    this.navCtrl.push(InVisumSearchPage);
  }
  
  faq() {
    this.navCtrl.push(InVisumFAQPage);
  }
  
  api(){
    this.navCtrl.push(InVisumApiPage);
  }
  
  legal(){
    this.navCtrl.push(InVisumLegalPage);
  }
}
