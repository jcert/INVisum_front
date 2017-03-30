import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PlotHelp } from '../../providers/providers';
import { PopupSelectTypePage } from './popup-select-type';
import { PopupInsertTypePage } from './popup-insert-type';

@Component({
  selector: 'page-in-visum-config-plot',
  templateUrl: 'in-visum-config-plot.html'
})
export class InVisumConfigPlotPage {
  graphTypes: any = ['Histogram','Bar','Line','Scatter'];
  constructor(public navCtrl: NavController, public pH: PlotHelp, public popoverCtrl: PopoverController) {
    //MAKE OPERATIONS
    pH.prepare();
  
  
  }
  
  getGraphType() {
    his.pH.clearCurrent();    
    let popover = this.popoverCtrl.create(PopupSelectTypePage,{title:'Tipos de gráficos',field:'type',list:this.graphTypes});
    popover.present();
  }
  
  getInput(x) {
    let popover = this.popoverCtrl.create(PopupInsertTypePage,{title:'Entre com um '+x[1],inputType:x[1],field:x[0]});
    popover.present();
  }
}
