import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { postLoginNavItems } from '../../../../configs/postlogin_nav.config';
import { Router } from '@angular/router';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {

  preLoginlistOfPages: any = [
    {
      title: 'Agent', pages: [
        { name: 'Overview', route: '/overview' },
        { name: 'login', route: '/login' },
        { name: 'Register', route: '/register' },
        { name: 'FAQ', route: '/help' }
      ]
    }
  ];
  isUserLoggedIn: boolean = false;
  postLoginlistOfPages1: any = this.generatePostNavList();
  postLoginlistOfPages2: any = [{
    "title": "Finances",
    pages: [
      { name: 'Link codes', route: '/user/linkcodes', icon: 'icon-link' },
      { name: 'Referral codes', route: '/user/referralcodes', icon: 'icon-tag' },
      { name: 'Banners', route: '/user/banners', icon: 'icon-tag' },
      { name: 'Campaigns list', route: '/user/campaignslist', icon: 'icon-list' },
      { name: 'My Info', route: '/user/profile', icon: 'icon-user' }
    ]
  }];
  postLoginlistOfPages3: any = [{
    "title": "Players",
    pages: [
      { name: 'Players list', route: '/user/playerslist' },
      { name: 'Create player', route: '/user/createplayer' },
      { name: 'Players revenue', route: '/user/playersrevenue' },
      { name: 'Verify player', route: '/user/verifyplayer' }
    ]
  }];
  postLoginlistOfPages4: any = [{
    "title": "Referring",
    pages: [
      { name: 'Agents list', route: '/user/agentslist' },
      { name: 'Create agent', route: '/user/createagent' },
      { name: 'Agents revenue', route: '/user/agentsrevenue' },
      { name: 'Referring tree', route: '/user/referringtree' }
    ]
  }];
  postLoginlistOfPages5: any = [{
    "title": "Referring",
    pages: [
      { name: 'Link codes', route: '/user/linkcodes' },
      { name: 'Referral codes', route: '/user/referralcodes' }
    ]
  }];
  listOfPages: any = [];
  constructor(private authSer: AuthService, private toastSer: ToastService, private route: Router) {
    this.toastSer.hideOverLay();
    this.authSer.routeLoginCheckHandler.subscribe((cb: ApiResponseModel) => {
      if (cb) {
        if (cb.apistatus["isSuccess"] && cb.response.success) {
          // SET LOCAL DATA
          this.isUserLoggedIn = true;
        }
        //this.isInitialResponseRendered = true;
      }
    });
    if (this.authSer.getOnLoadFirstHttpHitForLoginCheck()) {
      this.isUserLoggedIn = this.authSer.getisUserAuthenticated();
    }
  }

  ngOnInit() {
  }
  generatePostNavList() {
    let listOfPagesFromPostNav = [{
      "title": "Account",
      pages: [
        { name: 'Summary', route: '/user/statistics' },
        { name: 'Campaigns', route: '/user/campaigns' },
        { name: 'Payments', route: '/user/payments' },
        { name: 'Revenue Adjustments', route: '/user/revenueadjustments' },
        { name: 'Cancelled Payments', route: '/user/cancelledpayments', icon: 'icon-chart' },
        { name: 'Chargeback’s', route: '/user/chargebacks', icon: 'icon-chart' }

      ]
    }];
    return listOfPagesFromPostNav;
  }
  navigate(path) {
    this.route.navigate([path]);
  }

}