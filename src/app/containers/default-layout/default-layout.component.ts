import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { preloginNavItems } from '../../../configs/prelogin_nav.config';
import { AuthService } from '../../http/authservices/auth.service';
import { postLoginNavItems } from '../../../configs/postlogin_nav.config';
import { Router } from '@angular/router';
import { ApiResponseModel } from '../../../models/ApiResponse.model';
import { ToastService } from '../../../services/toast.service';
import { toastmsgs } from '../../../constants/toastmsgs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  public isInitialResponseRendered = false;
  public userdata: any = null;
  public userCashbalance: any = "loading";
  constructor(private authSer: AuthService, private router: Router, private toaster: ToastService) {
    this.authSer.routeLoginCheckHandler.subscribe((cb: ApiResponseModel) => {
      if (cb) {
        if (cb.apistatus["isSuccess"] && cb.response.success) {
          // SET LOCAL DATA 
          this.setDataOnSuccessfulLogin(cb.response);
        }
        this.isInitialResponseRendered = true;
      }
    });
    this.authSer.logoutHandler.subscribe((data) => {
      if (data != null) {
        // clear this level data 
        this.resetOnLogout();
        this.toaster.showToaster(toastmsgs.logout.success, "success");
      }
    });
    this.authSer.loginHandler.subscribe((profileDataRes) => {
      if (profileDataRes != null) {
        if (profileDataRes["success"]) {
          this.setDataOnSuccessfulLogin(profileDataRes);
        }
      }
    });
    // this.authSer.balanceLoaderHandler.subscribe((res) => {
    //   if (res) {
    //     if (res.status) {
    //       this.userCashbalance = res["cashbalance"];
    //     }
    //     else
    //       this.userCashbalance = "NA";
    //   }
    // })
  }
  public sidebarMinimized = false;
  public navItems = preloginNavItems;
 //public navItems = postLoginNavItems; 
 public isUserLoggedIn: Boolean = false;
  ngAfterViewInit() {
    let burgerMenuNodes = document.getElementsByClassName("navbar-toggler");
    burgerMenuNodes[2].remove();
    burgerMenuNodes[2].remove();
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout() {
    this.authSer.logout();
  }
  resetOnLogout() {
    this.isUserLoggedIn = false;
    this.navItems = preloginNavItems;
    this.router.navigate(['/login']);
  }
  navigate(path) {
    this.router.navigate([path]);
  }
  setDataOnSuccessfulLogin(data) {
    this.navItems = postLoginNavItems;
    this.userdata = data;
    this.isUserLoggedIn = true;
  }

}
