import { Injectable } from '@angular/core';
import { ApiTalker } from './api-talker';
import { SetSelect } from './set-select';
import { MakeOperation } from './make-operation';
import 'rxjs/add/operator/map';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class PlotHelp {
  sourceDataList: any;
  
  
  possibleParam: any =['type'];//all other possibilities will be added in the constructor
  graphTypeParam: any = {
      'Histogram' :[['values','string'],['label','string'],['agg','string'],['bins','string'],['density','number']],
      'Bar'       :[['values','string'],['label','string']],
      'Line'      :[['x','string'],     ['y','string']],
      'Scatter'   :[['x','string'],     ['y','string']]
      };
  graphTypes: any = Object.keys(this.graphTypeParam);
  graphParam: any = [['plot_width','number'],['plot_height','number'],['legend','string']];
  
  currentParams: any = {};
  
  constructor( public api: ApiTalker,  public sets: SetSelect, public mOp: MakeOperation ) {
    let res: any = [];
    for(let i of Object.keys(this.graphTypeParam)) {
      res = res.concat!(this.graphTypeParam[i]);
    }
    for(let i in res) {
      res[i] = res[i][0];
    }
    let unique = res.filter((v, i, a) => a.indexOf(v) === i);
    this.possibleParam = this.possibleParam.concat(unique);
    res = [];
    for(let i of this.graphParam) {
      res.push(i[0]);
    }
    this.possibleParam = this.possibleParam.concat(res);
  }
  
  clearCurrent() {
    this.currentParams = {};
  }
  
  getBasicParam() {
    return this.graphParam;
  }
  getTypeParam() {
    return null || this.graphTypeParam[this.currentParams.type];
  }
  getFromCurrent(x) {
    return null || this.currentParams[x];
  }
  
  inputParam(field,x) {
    this.currentParams[field] = x;
    console.log(this.currentParams);
    }
 
  prepare() {
    this.sourceDataList = {};
    this.currentParams = {};
    this.api
        .getComplete('personal/')
        .map( resp => resp.json())
        .subscribe( res => 
          {
            console.log(res);this.sourceDataList = res
          }, 
          error => console.log('error')
        );
  }   

}
