import { Component, OnInit } from '@angular/core';
import { appConf } from '../../../../configs/app.config';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../http/authservices/auth.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { UtilitiesService } from '../../../../services/utilities.service';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-camplist',
  templateUrl: './camplist.component.html',
  styleUrls: ['./camplist.component.css']
})
export class CamplistComponent implements OnInit {
  public iSDatarendered: boolean = false;
  public isApiFailed: boolean = false;
  public codesData: any = null;
  public codesStatus: any = {};
  public totalCodes: any = 0;
  public noDataAvailableMsg = appConf.noDataForReferralCodes;
  private api: any = environment["api_url"] + environment["campaignList"];
  private postData: any = {
    data: {},
    headers: {}
  };
  currentIndex: any;
  currentAction: any;
  constructor(private router: Router, private authSer: AuthService,
    private toastSer: ToastService, private utilSer: UtilitiesService) {
    this.toastSer.showOverLay("Fetching codes ");
    this.authSer.getDataOnPostCall(this.api, this.postData, function (apiRes: ApiResponseModel) {
      this.toastSer.hideOverLay();
      if (apiRes.apistatus.isSuccess) {
        if (apiRes.response.success) {
          // change the api and collet the data 
          this.codesData = apiRes.response.campaignObjects ? apiRes.response.campaignObjects : null;
         // this.codesData = [{ type: 'CPA', name: 'latheesh', url: '' }]
          this.totalCodes = this.codesData ? this.codesData.length : 0;
          this.iSDatarendered = true;
        }
        else {
          this.toastSer.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
          this.isApiFailed = true;
        }
      }
    }.bind(this));

  }
  ngOnInit() {
  }
  navigate(path, obj?) {
    if (!obj)
      obj = {};
    this.router.navigate([path, obj]);
  }


}
