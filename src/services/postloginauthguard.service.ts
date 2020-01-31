import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/ApiResponse.model';
import { AuthService } from '../app/http/authservices/auth.service';
import { CookiemanagerService } from './cookiemanager.service';

@Injectable({
  providedIn: 'root'
})
export class PostloginauthguardService implements CanActivate {
  private firstHitHappend: Boolean = false;
  constructor(private authService: AuthService,
    private router: Router,
    private cookieService: CookiemanagerService) { }
  canActivate(): Observable<any> | Promise<any> | boolean {
    if (!this.firstHitHappend && !this.authService.getOnLoadFirstHttpHitForLoginCheck()) {
      this.firstHitHappend = true;
      this.authService.authenticateUserOnLoad((apiRes: ApiResponseModel) => {
        if (apiRes.apistatus["isSuccess"] && apiRes.response["success"]) {
          // USER IS LOGGED IN 
          return true;
        }
        else {
          this.router.navigate(['/login']);
        }
      });
    }
    else {
      if (this.authService.getisUserAuthenticated()) {
        // USER IS LOGGED IN 
        if (this.cookieService.getJsessionCookie()["isDataExists"]) {
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
}
