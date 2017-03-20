import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiTalker {
  url: string = 'http://127.0.0.1:8000/';

  constructor(public http: Http) {
  }


  get(endpoint: string, params?: any, options?: RequestOptions) {
/*    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }
*/

    return this.http.get(this.url + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }
  
  query(val: any) {
    console.log(this.url + "search/title/" + val.name);
    var obj = []; 
    this.http.get(this.url + "search/title/" + val.name).map( (resp:Response) => (resp.json()) ).subscribe( res => obj.push(res) );
    console.log(obj);
    return obj;
  }
}
