import { Injectable } from '@angular/core';
import { ApiResponseModel } from '../models/ApiResponse.model';
import { AuthService } from '../app/http/authservices/auth.service';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiemanagerService } from './cookiemanager.service';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class PostLoginAuthResolverService implements Resolve<any>{

  private firstHitHappend: Boolean = false;
  constructor(private authService: AuthService,
    private router: Router,
    private cookieService: CookiemanagerService,private toastSer:ToastService) { }

  resolve(): Observable<any> | Promise<any> | any {
    if (!this.firstHitHappend && !this.authService.getOnLoadFirstHttpHitForLoginCheck()) {
      this.toastSer.showOverLay();
      this.firstHitHappend = true;
      return this.authCheck().then((res) => {
        this.toastSer.hideOverLay();
        return res;
      });

    }
    else {
      if (this.authService.getisUserAuthenticated()) {
        // USER IS LOGGED IN 
        if (this.cookieService.getJsessionCookie()["isDataExists"]) {
          this.toastSer.hideOverLay();
          return true;
        }
        else { // BUT COOKIE IS CLEARED BY SOME ONE S
          this.authService.logout();
        }
      }
      else {
        this.router.navigate(['/login']);
      }
    }


  }

  authCheck(): Promise<any> {
    return new Promise((resolve) => {
      this.authService.authenticateUserOnLoad((apiRes: ApiResponseModel) => {
        if (apiRes.apistatus["isSuccess"] && apiRes.response["success"]) {
          // USER IS LOGGED IN 
          return resolve(true);
        }
        else {
          this.router.navigate(['/login']);
        }
      });
    });
  }

}
  // solve(path, cb) {
  //   if (path.indexOf("/user/balance") != -1)
  //     this.authService.getBalance((apiRes) => {
  //       return cb(apiRes);
  //     });
  //   else
  //     return cb(true);
  // }




