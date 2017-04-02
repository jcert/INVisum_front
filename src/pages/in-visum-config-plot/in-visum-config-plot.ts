import { Component } from '@angular/core';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { PlotHelp, ApiTalker } from '../../providers/providers';
import { PopupSelectTypePage } from './popup-select-type';
import { PopupInsertTypePage } from './popup-insert-type';
import { PopupDisplayGraphPage } from './popup-display-graph';

@Component({
  selector: 'page-in-visum-config-plot',
  templateUrl: 'in-visum-config-plot.html'
})
export class InVisumConfigPlotPage {
  graphTypes: any = ['Histogram','Bar','Line','Scatter'];
  constructor(public navCtrl: NavController, public pH: PlotHelp, public popoverCtrl: PopoverController, public api: ApiTalker,public modalCtrl: ModalController) {
    //MAKE OPERATIONS
    pH.prepare();
  }

  presentModal() {
    let modal = this.modalCtrl.create(PopupDisplayGraphPage);
    modal.present();
  }
  getWorkingSet() {    
    let popover = this.popoverCtrl.create(PopupSelectTypePage,{title:'Selecione um Dataset',field:'set',list:this.pH.workingSet(),nameFunct: (x) => x.id});
    popover.present();
  }
  getGraphType() {
    this.pH.clearCurrent();    
    let popover = this.popoverCtrl.create(PopupSelectTypePage,{title:'Tipos de gráficos',field:'type',list:this.graphTypes});
    popover.present();
  }
  getInput(x) {
    let popover = this.popoverCtrl.create(PopupInsertTypePage,{title:'Entre com um '+x[1],inputType:x[1],field:x[0]});
    popover.present();
  }
  goToGraph(x) {
    this.navCtrl.push(PopupDisplayGraphPage,{graphId:x});
    //this.presentModal();
    //let popover = this.popoverCtrl.create(PopupDisplayGraphPage,{graphId:x});
    //popover.present();
  }
  createGraph() {
    let set : any = this.pH.getFromCurrent('set');
    let typeName: any = this.pH.getFromCurrent('type');
    if(set&&typeName) {
      let id: any  = set.id;
      let typeId: any = this.pH.graphTypeToId(typeName); 
      console.log(this.pH.getAllFromCurrent());
      this.api.postComplete('personal/plot/'+typeId+'/'+id+'/', {}).subscribe( res => {this.goToGraph(JSON.parse(res.text()).id)});
        
    }
  }
}
