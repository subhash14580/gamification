import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../http/authservices/auth.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-addcamplist',
  templateUrl: './addcamplist.component.html',
  styleUrls: ['./addcamplist.component.css']
})
export class AddcamplistComponent implements OnInit {
  public action;
  public code: any = "";
  public campId = null;
  public name = null;
  public campaignObjectsList: null;
  public mode: any = 'create';
  campaignName: any = '';
  websiteurl: any = '';
  private addcampaignapi: any = environment["api_url"] + environment["addCampaign"];
  private editCampaignApi: any = environment["api_url"] + environment["editCampaign"];
  url: any;
  campIdTypeText: string;
  constructor(private router: Router, private route: ActivatedRoute, private authSer: AuthService, private toastSer: ToastService) {
    const snapShotData = this.route.snapshot.paramMap;
    if (snapShotData.get("mode") && snapShotData.get("campId")
      && snapShotData.get("url") && snapShotData.get("name") && snapShotData.get("campIdText") &&
      snapShotData.get("mode").toLowerCase() == "edit") {
      this.mode = "edit";
      this.campId = snapShotData.get("campId");
      this.websiteurl = snapShotData.get("url");
      this.campaignName = snapShotData.get("name");
      this.campIdTypeText = snapShotData.get("campIdText");
    }
    if (this.mode != "edit") {
      this.authSer.getCampaignLists(function (campaignObjects) {
        this.campaignObjectsList = campaignObjects;
        if (this.campaignObjectsList.length > 0) {
          this.campId = this.campaignObjectsList[0]["id"];
        }

        this.campaignObjectsList = [
          { id: 0, type: "Revenue Share" },
          { id: 1, type: "Cost per Acquisition" },
          { id: 2, type: "Sub Affiliate" }]
      }.bind(this));
    }
  }

  ngOnInit() {
  }
  navigate(path) {
    this.router.navigate([path]);
  }
  createCode() {
    if (!this.campId || (this.campaignName.trim().length == 0) || (this.websiteurl.trim().length == 0)) {
      this.toastSer.showToaster(toastmsgs.validationError.success, "error");
      return;
    }
    const postData = {
      data: {
        campaignTypeId: Number(this.campId),
        campaignName: this.campaignName,
        action: this.mode == "edit" ? "edit" : "add",
        url: this.websiteurl
      },
      headers: {

      }
    }
    if (this.mode == 'edit') {
      // add id to the postdata.data 
      postData.data["id"] = this.campId;
    }

    this.toastSer.showOverLay("Adding code..")
    const finalApi = this.mode != 'edit' ? this.addcampaignapi : this.editCampaignApi;
    this.authSer.getDataOnPostCall(finalApi, postData, this.dataHandler.bind(this));
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        // update tdatainfo 
        this.toastSer.showToaster(toastmsgs.refCodeCreation.success, "success")
      }
      else {
        let tstmsgobj = toastmsgs.register.error;
        "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
        this.toastSer.showToaster(tstmsgobj, "error");
      }
    }
  }
}

