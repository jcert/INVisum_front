import { Injectable } from '@angular/core';
import { RequestOptions, Response, Headers } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { InVisumLoginPage } from '../pages/in-visum-login/in-visum-login';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
import { Storage } from '@ionic/storage';

let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'inVisumToken',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json,text/html', 'Content-Type': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}


@Injectable()
export class ApiTalker {
  url: string = 'http://127.0.0.1:8000/';
  errorString: string;
  token: any = '';
  shouldRenew : any = false;  
  
  constructor(public authHttp: AuthHttp) {}

  getComplete(endpoint: string) {
    let y = new RequestOptions({method:'get',headers:new Headers({'Content-Type': 'application/json','Accept': 'application/json','Authorization': 'JWT '+this.token}), withCredentials:true});
    return this.authHttp.get(this.url + endpoint, y).catch(this.handleError);;
  }
  
  get(what:string) {
    return this.authHttp.get(this.url + what)
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  postComplete(endpoint: string, body: any) {
    let y = new RequestOptions({method:'post',headers:new Headers({'Content-Type': 'application/json','Authorization': 'JWT '+this.token}), withCredentials:true});
    return this.authHttp.post(this.url + endpoint, body, y).catch(this.handleError);
  }
  deleteComplete(endpoint: string) {
    let y = new RequestOptions({method:'delete',headers:new Headers({'Content-Type': 'application/json','Authorization': 'JWT '+this.token}), withCredentials:true});
    return this.authHttp.delete(this.url + endpoint, y).catch(this.handleError);
  }
 
  getFeatured() {
    let y = new RequestOptions({method:'get',headers:new Headers({'Content-Type': 'application/json','Authorization': 'JWT '+this.token}), withCredentials:true});
    return this.authHttp.get(this.url+'discover/',y).map( resp => resp.json()).catch(this.handleError);
  }
  
  logout() {
    this.shouldRenew = false;
    this.token = '';
  }
  
  authenticated() {
    return this.token != '';
  }
  
  //curl -X POST -H "Content-Type: application/json" -d '{"token":"<EXISTING_TOKEN>"}' http://localhost:8000/
  
  reauthenticate(user:string, pass:string) {
    if(this.shouldRenew) {
    Observable.timer(1000*6*3)
              .subscribe( r => {
                                  return this.authHttp.post(this.url+'auth/',{'username':user,'password':pass})
                                  .subscribe( resp => {this.token = JSON.parse(resp.text()).token;this.reauthenticate(user, pass)}, 
                                              err => this.handleError(err));} );
    }
  }
  
  authenticate(user:string, pass:string) {
    this.shouldRenew = true;
    this.reauthenticate(user, pass);
    return this.authHttp.post(this.url+'auth/',{'username':user,'password':pass})
               .subscribe( resp => {this.token = JSON.parse(resp.text()).token}, err => this.handleError(err));
  }

  post(what:string, options?: RequestOptions) {
    return this.authHttp.get(this.url + what, options)
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.put(this.url + '/' + endpoint, body, options).catch(this.handleError);
  }

  delete(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.post(this.url + '/' + endpoint, body, options).catch(this.handleError);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.put(this.url + '/' + endpoint, body, options).catch(this.handleError);
  }
  
  queryFeatured() {
    return this.authHttp.get(this.url + "discover/")
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  queryTitle(val: any) {
    return this.authHttp.get(this.url + "search/title/" + val.name + "/")
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }

  private handleError (error: Response) {
    let mess = JSON.parse(error.text()).detail || '';
    console.error(error);
    console.log("my error");
    if(mess.match(/expired/)) { //check if not logged in, if so, return to login-page
      this.token = '';
      //how to do this?
    }
    return Observable.throw( "server error");//error.json().error ||
  }
}
