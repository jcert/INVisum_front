import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { InVisumWelcomePage } from '../in-visum-welcome/in-visum-welcome';
import { User, FakeUser, ApiTalker} from '../../providers/providers';
import { Observable} from 'rxjs/Observable';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-in-visum-signup',
  templateUrl: 'in-visum-signup.html'
})
export class InVisumSignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  errorString: string;
  account: {name: string, email: string, password: string} = {
    name: 'master',
    email: 'test@example.com',
    password: 'a12345678'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public api: ApiTalker, 
              public fu : FakeUser) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    this.api.authenticate(this.account.name,this.account.password);
    Observable.timer(100).subscribe(() => {console.log('observable signup');this.navCtrl.setRoot(InVisumWelcomePage)}); // async operation
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
}
