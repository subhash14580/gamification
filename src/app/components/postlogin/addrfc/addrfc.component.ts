import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { appConf } from '../../../../configs/app.config';
import { AuthService } from '../../../http/authservices/auth.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-addrfc',
  templateUrl: './addrfc.component.html',
  styleUrls: ['./addrfc.component.css']
})
export class AddrfcComponent implements OnInit {
  public action;
  public code: any = "";
  public campId = null;
  public name = null;
  public campaignObjectsList: any = [];
  public mode: any = 'create';
  public api: any = environment["api_url"] + environment["get_referralCodes"];
  constructor(private router: Router, private route: ActivatedRoute, private authSer: AuthService, private toastSer: ToastService) {
    const snapShotData = this.route.snapshot.paramMap;
    if (snapShotData.get("mode") && snapShotData.get("campId") && snapShotData.get("code") &&
      snapShotData.get("mode").toLowerCase() == "edit") {
      this.mode = "edit";
      this.campId = snapShotData.get("campId");
      this.code = snapShotData.get("code");
    }
    this.authSer.getCampaignLists(function (campaignObjects) {
      this.campaignObjectsList = campaignObjects;
      if (this.campaignObjectsList.length > 0) {
        if (this.mode != 'edit')
          this.campId = this.campaignObjectsList[0]["id"];
      }
    }.bind(this));
  }

  ngOnInit() {
  }
  navigate(path) {
    this.router.navigate([path]);
  }
  createCode() {
    if (!this.campId || !this.code || this.campaignObjectsList.length == 0) {
      this.toastSer.showToaster(toastmsgs.validationError.success, "error");
      return;
    }
    const postData = {
      data: {
        code: this.code,
        campId: this.campId,
        action: this.mode == "edit" ? "UPDATE" : "CREATE",
        name: this.code
      },
      headers: {

      }
    }
    this.toastSer.showOverLay("Adding code..")
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        // update tdatainfo 
        let msgObj = this.mode == 'edit' ? toastmsgs.refCodeUpdation.success : toastmsgs.refCodeCreation.success;
        this.toastSer.showToaster(msgObj, "success")
      }
      else {
        let tstmsgobj = toastmsgs.register.error;
        "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
        this.toastSer.showToaster(tstmsgobj, "error");
      }
    }
  }
}
