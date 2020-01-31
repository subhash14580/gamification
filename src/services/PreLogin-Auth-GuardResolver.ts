import { Injectable } from '@angular/core';
import { AuthService } from '../app/http/authservices/auth.service';
import { CanActivate, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { ApiResponseModel } from '../models/ApiResponse.model';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PreLoginAuthGuardResolver implements Resolve<any> {
  private firstHitHappend: Boolean = false;
  constructor(private authService: AuthService, private router: Router, private toastSer: ToastService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {

    let fromPath = null;
    if (route.data && ("pathfrom" in route.data)) {
      fromPath = route.data["pathfrom"];
    }
    if (!this.firstHitHappend && !this.authService.getOnLoadFirstHttpHitForLoginCheck()) {
      this.toastSer.showOverLay();
      this.firstHitHappend = true;
      this.authService.authenticateUserOnLoad((apiRes: ApiResponseModel) => {
        if (apiRes.apistatus["isSuccess"] && apiRes.response["success"]) {
          if (fromPath && fromPath == "allowpage") {
            this.toastSer.hideOverLay();
            return true;
          }
          this.router.navigate(['/user/statistics']);
        }
        else {
          this.toastSer.hideOverLay();
          return true;

        }
      })
    }
    else {
      this.toastSer.hideOverLay();
      if (this.authService.getisUserAuthenticated()) {
        if (fromPath && fromPath == "allowpage") {
          this.toastSer.hideOverLay();
          return true;
        }
        this.router.navigate(['/user/statistics']);
      }
      else {
        return true;
      }
    }


  }

}