import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';




import { LoginComponent } from './components/prelogin/login/login.component';
import { RegisterComponent } from './components/prelogin/register/register.component';
import { ForgotpwsdComponent } from './components/prelogin/forgotpwsd/forgotpwsd.component';
import { PreLoginAuthGuardResolver } from '../services/PreLogin-Auth-GuardResolver';

import { OverviewComponent } from './components/prelogin/overview/overview.component';
import { HelpComponent } from './components/prelogin/help/help.component';

import { ProfileComponent } from './components/postlogin/profile/profile.component';

import { CreateplayerComponent } from './components/postlogin/createplayer/createplayer.component';
import { PlayersrevenueComponent } from './components/postlogin/playersrevenue/playersrevenue.component';


import { LinkcodesComponent } from './components/postlogin/linkcodes/linkcodes.component';
import { ReferralcodesComponent } from './components/postlogin/referralcodes/referralcodes.component';
import { AddrfcComponent } from './components/postlogin/addrfc/addrfc.component';
import { PostLoginAuthResolverService } from '../services/post-login-auth-resolver.service';
import { PagenotfoundComponent } from './components/error/pagenotfound/pagenotfound.component';

import { ContactComponent } from './components/prelogin/contact/contact.component';
import { SitemapComponent } from './components/prelogin/sitemap/sitemap.component';
import { TermsComponent } from './components/prelogin/terms/terms.component';
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
import { ThuntComponent } from './components/postlogin/thunt/thunt.component';
import { ShareComponent } from './components/postlogin/share/share.component';
import { LboardComponent } from './components/postlogin/lboard/lboard.component';



export const routes: Routes = [{
  path: '',
  component: LoginComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},

{
  path: 'login', component: LoginComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'register', component: RegisterComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'forgotpswd', component: ForgotpwsdComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'overview', component: OverviewComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'help', component: HelpComponent,
  resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'user',
  children: [
    { path: 'profile', component: ProfileComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'createplayer', component: CreateplayerComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'playersrevenue', component: PlayersrevenueComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'linkcodes', component: LinkcodesComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'referralcodes', component: ReferralcodesComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'addfhr', component: AddrfcComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'chargebacks', component: ChargebacksComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'revenueadjustments', component: RvnadjstmntsComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'cancelledpayments', component: CanclpymtsComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'banners', component: BannersComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'payments', component: PaymentsComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'campaignslist', component: CamplistComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'addcamp', component: AddcamplistComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'statistics', component: StatisticsComponent, resolve: { res: PostLoginAuthResolverService } },
    { path: 'campaigns', component: CampstatsComponent, resolve: { res: PostLoginAuthResolverService } }
    , { path: 'gamezone', component: ThuntComponent, resolve: { res: PostLoginAuthResolverService }},
{ path: 'share', component: ShareComponent, resolve: { res: PostLoginAuthResolverService } },
{ path: 'lboard', component: LboardComponent, resolve: { res: PostLoginAuthResolverService } }

]
},
{
  path: '404', component: PagenotfoundComponent,
    resolve: {
    res: PreLoginAuthGuardResolver
  }
},
{
  path: 'contact', component: ContactComponent, resolve: {
    res: PreLoginAuthGuardResolver
  },
  data: { pathfrom: 'allowpage' }
},
{
  path: 'sitemap', component: SitemapComponent, resolve: {
    res: PreLoginAuthGuardResolver
  },
  data: { pathfrom: 'allowpage' }
},
{
  path: 'terms', component: TermsComponent, resolve: {
    res: PreLoginAuthGuardResolver
  },
  data: { pathfrom: 'allowpage' }
},
{
  path: 'privacypolicy',
    component: PpolicyComponent, resolve: {
    res: PreLoginAuthGuardResolver
  },
  data: { pathfrom: 'allowpage' }
},
{
  path: 'affiliateprograms',
    component: AffprgrmsComponent, resolve: {
    res: PreLoginAuthGuardResolver
  },
  data: { pathfrom: 'allowpage' }
},
{
  path: '**', redirectTo: '/404'
}


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
