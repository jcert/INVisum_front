import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
 
import { NgModule} from '@angular/core';
import { CommonModule }   from '@angular/common';
import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
     ],
    declarations: [ ],
    exports: [ ],
    providers: [
        {
            provide: XSRFStrategy,
            useValue: new CookieXSRFStrategy('csrftoken', 'X-CSRFToken')
        }
    ]
})
 
 
@Injectable()
export class ApiTalker {
  url: string = 'http://127.0.0.1:8000/';
  errorString: string;
  csrftoken: any = '';

  constructor(public http: Http) {
  }

  
  getComplete(endpoint: string, params?: any, options?: RequestOptions) {
    return this.http.get(this.url + endpoint, options);
  }
  
  get(what:string) {
    return this.http.get(this.url + what, this.getRequestOptions())
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  
  postComplete(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + endpoint, body, options);
  }
  
  getFinalToken(csrfmiddlewaretoken:string,user:string, pass:string) {
    let x = new RequestOptions({headers:new Headers({'Content-Type': 'application/json'}), withCredentials:true});
    this.postComplete('authentication/login/','csrfmiddlewaretoken='+csrfmiddlewaretoken+'&username='+user+'&password='+pass,x)
        .subscribe( resp  => console.log(resp),
                    error => this.errorString =  <any> error
                  );
    //this.postComplete()    
  } 
  
  authenticate(user:string, pass:string) {
    let x = new RequestOptions(new Headers({"Referer":this.url+"authentication/login/"}));
    this.getComplete('authentication/login/', new RequestOptions(x)).subscribe(
      resp  => {this.getFinalToken(resp.text().match(/csrfmiddlewaretoken' value='(\S*)'/)[1],user,pass); //this will get the csrfmiddlewaretoken, use to login and get the final one
       console.log(resp)},
      error => this.errorString =  <any> error
      );
     
    //name='csrfmiddlewaretoken' value='Zi937Fv7UzCwHAIwsWIIVyIm7oaM9xTHdIcfUgvmGoSCLHT9HCflj6J2HbuApKzl'  
  }
  

  post(what:string, options?: RequestOptions) {
    return this.http.get(this.url + what, options)
                  .map( resp => resp.json())
                  .catch(this.handleError);
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
  
  queryFeatured() {
    return this.http.get(this.url + "discover/",this.getRequestOptions())
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  queryTitle(val: any) {
    return this.http.get(this.url + "search/title/" + val.name + "/")
                  .map( resp => resp.json())
                  .catch(this.handleError);
  }
  
  public setToken(x:any) {
    // todo: some logic to retrieve the cookie here. we're in a service, so you can inject anything you'd like for this
    this.csrftoken = x;
  }
  
  private get xsrfToken() {
    // todo: some logic to retrieve the cookie here. we're in a service, so you can inject anything you'd like for this
    return this.csrftoken;
  }
  
  private getRequestOptions() {
    //'Content-Type': 'application/json', 
    const headers = new Headers({'X-XSRF-TOKEN': this.xsrfToken});
    return new RequestOptions({headers: headers});
  }
  
  private handleError (error: Response) {
    console.error(error);
    console.log("my error");
    return Observable.throw(error.json().error || "server error");
  }
}
