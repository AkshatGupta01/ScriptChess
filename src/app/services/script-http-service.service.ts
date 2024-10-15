import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScriptHttpServiceService {

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {

  }

  doGet<T>(path: string, headerExtra: any) {
    let headers = this.getHeaders(path)

    if(headerExtra) {
      for(let key in headerExtra)
        headers = headers.append(key, headerExtra[key])
    }
    headers = this.addAuthHeader(headers, path);
    try {
      return this.http.get<T>(path, {headers: headers, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }

  doGetWithoutHeaders<T>(path: string, headerExtra: any) {
    try {
      return this.http.get<T>(path, {headers: headerExtra, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }

  doGetPlain<T>(path: string, headerExtra: any) {

    let headers = this.getHeaders(path)
    if(headerExtra) {
      for(let key in headerExtra)
        headers = headers.append(key, headerExtra[key])
    }
    headers = this.addAuthHeader(headers, path);

    try {
      return this.http.get(path, {headers: headers, responseType: 'text'});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }

  doPost<T>(path: string, headerExtra: any, body: any) {
    let headers = this.getHeaders(path)
    if(headerExtra) {
      for(let key in headerExtra)
      headers = headers.append(key,headerExtra[key]);
    }
    headers = this.addAuthHeader(headers, path);
    try {
      return this.http.post<T>(path, body, {headers: headers, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }

  doPatch<T>(path: string, headerExtra: any, body: any) {
    let headers = this.getHeaders(path)
    if(headerExtra) {
      for(let key in headerExtra)
      headers = headers.append(key,headerExtra[key]);
    }
    headers = this.addAuthHeader(headers, path);
    try {
      return this.http.patch<T>(path, body, {headers: headers, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }

  doDelete(path: string, headerExtra: any) {
    let headers = this.getHeaders(path)
    if(headerExtra) {
      for(let key in headerExtra)
      headers = headers.append(key,headerExtra[key]);
    }
    headers = this.addAuthHeader(headers, path);
    try {
      return this.http.delete(path,{headers: headers, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }
  }



  doPut<T>(path: string, headerExtra: any, body: any) {
    let headers = this.getHeaders(path)
    if(headerExtra) {
      for(let key in headerExtra)
        headers = headers.append(key,headerExtra[key]);
    }
    headers = this.addAuthHeader(headers, path);
    try {
      return this.http.put<T>(path,body, {headers: headers, observe: "response"});
    } catch(error) {
      this.clearAuthToken(error);
      throw error;
    }

  }

  clearAuthToken(error: any) {
    if(error[status] == 403 || error[status] == 401) {

    }
    throw error;
  }

  getUrlString(body : any) {
    let urlString : string = "";
    for(let key in body) {
      if(urlString)
          urlString = urlString + "&" + key +"="+body[key];
      else
        urlString = key +"="+body[key];
   }
   return urlString;
  }

  addAuthHeader(headers : HttpHeaders, path : string) {
    if(isPlatformBrowser(this.platformId) && (path.startsWith("https://api.scriptchess.com") || path.startsWith("http://localhost"))) {
      let tokenStr = localStorage.getItem("auth");
      if(tokenStr) {
        headers = headers.append('Authorization', 'Bearer ' + tokenStr);
      }
    }
    return headers;
  }

  getHeaders(path : string) : HttpHeaders {

    let headers = new HttpHeaders();
    // if(!path.startsWith("https://blog.dealsdelta.com")) {
    //   let session = localStorage.getItem("SESSION");
    //   if(session) {
    //     headers = headers.append("SESSION", session);
    //   }
    // }
    return headers;
  }
}
