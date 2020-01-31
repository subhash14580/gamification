import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpconnectService {

  constructor(private http: HttpClient) { }

  invokeGetCall(url, callback) {
    this.http.get(url).subscribe((res) => {
      console.log('URL:' + url + ':response:' + res);
      if (callback) {
        callback(res);
      }
    });
  }

  // invokePostCall(url, postData, callback) {
  //   this.http.post(url, postData["data"], { "headers": postData["headers"] }).subscribe((res) => {
  //     console.log('URL:' + url + ':response:' + res);
  //     if (callback) {
  //       callback(res);
  //     }
  //   });
  // }

  invokePostBlobCall(url, postData, callback) {
    this.http.post<Blob>(url, postData["data"], { "headers": postData["headers"], "responseType": 'blob' as 'json' }).subscribe((res) => {
      console.log('URL:' + url + ':response:' + res);
      if (callback) {
        callback(res);
      }
    });
  }

  invokePostCall(url, postData, callback) {
    this.http.post(url, postData["data"], { "headers": postData["headers"] }).toPromise().then((res) => {
      console.log('URL:' + url + ':response:' + res);
      if (callback) {
        callback(res);
      }
    })
      .catch((err) => {
        const failedMsg ={success:false,code:err["statusText"]};
        callback(failedMsg);
      })
  }



}
