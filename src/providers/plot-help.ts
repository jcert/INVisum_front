import { Injectable } from '@angular/core';
import { ApiTalker } from './api-talker';
import { SetSelect } from './set-select';
import { MakeOperation } from './make-operation';
import 'rxjs/add/operator/map';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class PlotHelp {
  sourceDataList: any;
  
  
  possibleParam: any =['type','set'];//all other possibilities will be added in the constructor
  graphTypeParam: any = {
      'Histogram' :[['values','string'],['label','string'],['agg','string'],['bins','string'],['density','number']],
      'Bar'       :[['values','string'],['label','string']],
      'Line'      :[['x','string'],     ['y','string']],
      'Scatter'   :[['x','string'],     ['y','string']]
      };
  
  graphTypeToId(x:string){
    let translationTable: any = {'Histogram':1,'Bar':2,'Line':3,'Scatter':4};  
    return null || translationTable[x];
  }
      
  graphTypes: any = Object.keys(this.graphTypeParam);
  graphParam: any = [['legend','string']]; //Enum('top_left', 'top_center', 'top_right', 'center_left', 'center', 'center_right', 'bottom_left', 'bottom_center', 'bottom_right') 
  //['plot_width','number'],['plot_height','number'],  
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
  workingSet() {
    return null || this.sourceDataList;
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
  getAllFromCurrent() {
    return this.currentParams;
  }
  getFromCurrent(x) {
    return null || this.currentParams[x];
  }
  
  optionalParameters() {
    let body : any = {};
    for( let y of Object.keys(this.currentParams)) {
      body[y] = this.currentParams[y];
    }
    delete body.type;
    delete body.set;
    
    console.log('optional body',body);
    return body;
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
