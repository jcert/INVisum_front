import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { InVisumWelcomePage } from '../in-visum-welcome/in-visum-welcome';
import { InVisumSignupPage } from '../in-visum-signup/in-visum-signup';
import { ApiTalker} from '../../providers/api-talker';
import { Observable} from 'rxjs/Observable';

/*
  Generated class for the InVisumLogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-in-visum-login',
  templateUrl: 'in-visum-login.html'
})
export class InVisumLoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {name: string, email: string, password: string} = {
    name: 'master',
    email: 'test@example.com',
    password: 'a12345678'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public navPar: NavParams,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public api: ApiTalker) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    this.api.authenticate(this.account.name,this.account.password);
    Observable.timer(300).subscribe(() => {console.log('observable signup');if(this.api.authenticated()){this.navCtrl.setRoot(InVisumWelcomePage)}}); // async operation
  
    // Attempt to login in through our User service
    /*
    this.user.signup(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {

      this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });*/
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InVisumLoginPage');
  }

  cadastro() {
    this.navCtrl.push(InVisumSignupPage);  
  }
}

