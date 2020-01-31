import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { appConf } from '../../../../configs/app.config';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-referralcodes',
  templateUrl: './referralcodes.component.html',
  styleUrls: ['./referralcodes.component.css']
})
export class ReferralcodesComponent implements OnInit {
  public iSDatarendered: boolean = false;
  public isApiFailed: boolean = false;
  public codesData: any = null;
  public codesStatus: any = {};
  public totalCodes: any = 0;
  public noDataAvailableMsg = appConf.noDataForReferralCodes;
  private api: any = environment["api_url"] + environment["get_referralCodes"];
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
          this.codesData = apiRes.response.promoCodes ? apiRes.response.promoCodes : null;
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
  modifyCode(index, action: string) {
    if (index >= this.totalCodes) {
      this.toastSer.showToaster(toastmsgs.validationError.success, "error");
      return;
    }
    const postData = {
      data: {
        code: this.codesData[index]["code"],
        campId: this.codesData[index]["id"],
        action: action.toLowerCase(),
        name: this.codesData[index]["code"]
      },
      headers: {

      }
    }
    this.currentIndex = index;
    this.currentAction = action;
    this.toastSer.showOverLay("On the way ..")
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        // update tdatainfo
        let k = this.codesData[this.currentIndex]["status"];
        this.codesData[this.currentIndex]["status"] = this.codesData[this.currentIndex]["status"] == "Active" ? "InActive" : "Active";
        this.toastSer.showToaster(toastmsgs.successmsg.success, "success")
      }
      else {
        let tstmsgobj = toastmsgs.register.error;
        "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
        this.toastSer.showToaster(tstmsgobj, "error");
      }
    }
  }
  getListOfValues(val) {
    return this.utilSer.getListOfValues(val);
  }

}
