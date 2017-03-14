
import { NavController, NavParams} from 'ionic-angular';
import { Component, Input } from '@angular/core';


//@Injectable()
@Component({
  selector: 'reputation-icon',
  template: '<ion-icon name=\"{{ icon }}\" [ngStyle]=\"{\'color\': color_by_rep(reputation)}\"></ion-icon>' 
})
//'<ion-icon name={{ icon }} [style.color]=></ion-icon>'
export class ReputationIcon{  
  @Input() icon: string = "add";
  @Input() reputation: number = 50; 
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }
  
  color_by_rep(x){
    //give me a number from 0 to 100, representing a percentage
    //and I'll give a color, redder the smaller, greener the larger
    x = (x>100)? 100:x;
    x =  (x<0) ?  0:x;
    x = Math.round(x);
    return "rgb("+ (200-x*2).toString() +",0"+","+ (2*x).toString() +")";
  }
}

