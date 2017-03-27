import { Injectable } from '@angular/core';
import { RequestOptions, Response, Headers } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthHttp, AuthConfig } from 'angular2-jwt';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
import { Storage } from '@ionic/storage';

let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'inVisumToken',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json', 'Content-Type': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}


@Injectable()
export class ApiTalker {
  url: string = 'http://127.0.0.1:8000/';
  errorString: string;
  token: any = '';

  constructor(public authHttp: AuthHttp) {}

  getComplete(endpoint: string, params?: any, options?: RequestOptions) {
    return this.authHttp.get(this.url + endpoint, options);
  }
  
  get(what:string) {
    return this.authHttp.get(this.url + what)
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  postComplete(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.post(this.url + endpoint, body, options);
  }
 
  getFeatured() {
    let y = new RequestOptions({method:'get',headers:new Headers({'Content-Type': 'application/json','Authorization': 'JWT '+this.token}), withCredentials:true});
    return this.authHttp.get(this.url+'discover/',y).map( resp => resp.json()).catch(this.handleError);
  }
  
  authenticated() {
    return this.token != '';
  }
  
  authenticate(user:string, pass:string) {
    return this.authHttp.post(this.url+'auth/',{'username':user,'password':pass})
               .subscribe( resp => {this.token = JSON.parse(resp.text()).token}, err => console.log('error authenticate'));
  }

  post(what:string, options?: RequestOptions) {
    return this.authHttp.get(this.url + what, options)
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.post(this.url + '/' + endpoint, body, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.authHttp.put(this.url + '/' + endpoint, body, options);
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
    console.error(error);
    console.log("my error");
    return Observable.throw(error.json().error || "server error");
  }
}
