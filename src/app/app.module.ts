import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';


//import { LoginComponent } from './views/login/login.component';
//import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from './http/http.module';
import { ForgotpwsdComponent } from './components/prelogin/forgotpwsd/forgotpwsd.component';
import { OverviewComponent } from './components/prelogin/overview/overview.component';
import { HelpComponent } from './components/prelogin/help/help.component';
import { RegisterComponent } from './components/prelogin/register/register.component';
import { LoginComponent } from './components/prelogin/login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { ProfileComponent } from './components/postlogin/profile/profile.component';
import { CreateplayerComponent } from './components/postlogin/createplayer/createplayer.component';
import { PlayersrevenueComponent } from './components/postlogin/playersrevenue/playersrevenue.component';


import { LinkcodesComponent } from './components/postlogin/linkcodes/linkcodes.component';
import { ReferralcodesComponent } from './components/postlogin/referralcodes/referralcodes.component';
import { AddrfcComponent } from './components/postlogin/addrfc/addrfc.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';

import { NgxSpinnerModule } from "ngx-spinner";
import { OopsComponent } from './components/error/oops/oops.component';
import { PagenotfoundComponent } from './components/error/pagenotfound/pagenotfound.component';
import { DatatableComponent } from './components/postlogin/datatable/datatable.component';
import { ContactComponent } from './components/prelogin/contact/contact.component';
import { TermsComponent } from './components/prelogin/terms/terms.component';
import { SitemapComponent } from './components/prelogin/sitemap/sitemap.component';
import { PpolicyComponent } from './components/postlogin/ppolicy/ppolicy.component';
import { AffprgrmsComponent } from './components/prelogin/affprgrms/affprgrms.component';
import { CamplistComponent } from './components/postlogin/camplist/camplist.component';
import { AddcamplistComponent } from './components/postlogin/addcamplist/addcamplist.component';
import { StatisticsComponent } from './components/postlogin/statistics/statistics.component';
import { PaymentsComponent } from './payments/payments.component';
import { ChargebacksComponent } from './components/postlogin/chargebacks/chargebacks.component';
import { CanclpymtsComponent } from './components/postlogin/canclpymts/canclpymts.component';
import { RvnadjstmntsComponent } from './components/postlogin/rvnadjstmnts/rvnadjstmnts.component';
import { BannersComponent } from './components/postlogin/banners/banners.component';
import { CampstatsComponent } from './components/postlogin/campstats/campstats.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,
    ForgotpwsdComponent,
    OverviewComponent,
    HelpComponent,
    RegisterComponent,
    ProfileComponent,
    CreateplayerComponent,
    PlayersrevenueComponent,
    LinkcodesComponent,
    ReferralcodesComponent,
    AddrfcComponent,
    OopsComponent,
    PagenotfoundComponent,
    DatatableComponent,
    ContactComponent,
    TermsComponent,
    SitemapComponent,
    PpolicyComponent,
    AffprgrmsComponent,
    CamplistComponent,
    AddcamplistComponent,
    StatisticsComponent,
    PaymentsComponent,
    ChargebacksComponent,
    CanclpymtsComponent,
    RvnadjstmntsComponent,
    BannersComponent,
    CampstatsComponent

  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
