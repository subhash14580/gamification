import { Component, OnInit, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  selectedPlayerIndex: any = "";
  groupData: any = [];
  subLevelData: any = {};
  private postData: any = this.getBasicPostData();
  public isBalanceCallCompleted: boolean = false;
  public isApiFailed: boolean = false;
  private api = environment["api_url"] + environment["getNetworkbalance_api"];
  constructor(private authSer: AuthService, private toastSer: ToastService, private router: Router, private route: ActivatedRoute) {
    this.toastSer.showOverLay();
    this.authSer.getDataOnPostCall(this.api, this.postData, (apiRes: ApiResponseModel) => {
      console.log(apiRes);
      if (apiRes.apistatus.isSuccess) {
        if (apiRes.response["success"]) {
          this.isApiFailed = false;
          this.isBalanceCallCompleted = true;
          if ("agentObjects" in apiRes.response["values"]) {
            this.groupData = apiRes.response["values"]["agentObjects"];
            this.selectedPlayerIndex = 0;
            var key = Object.keys(apiRes.response["values"]["agentStatistics"])[0];
            this.subLevelData = apiRes.response["values"]["agentStatistics"][key];
          }
        }
        else {
          this.isApiFailed = true;
          const tstmsg = toastmsgs.simpleAPiErrormsg.success;
          tstmsg.title = apiRes.response["code"];
          this.toastSer.showToaster(tstmsg, "error");
        }
      }
      else {
        this.isApiFailed = true;
        this.toastSer.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
      //this.isBalanceCallCompleted = true;
      this.toastSer.hideOverLay();
    });
  }
  ngOnInit() {

  }

  onChange($event) {
    // pick list [ event.target.value]
    const selectedPlayer = this.groupData[Number($event.target.value)]["loginName"];
    const playerId = this.groupData[Number($event.target.value)]["agentId"];
    const postDataWithOwnerID = this.getBasicPostData();
    postDataWithOwnerID["data"]["owenrId"] = playerId;
    this.toastSer.showOverLay("Fetchind data for " + this.groupData[Number($event.target.value)]["loginName"]);
    this.authSer.getDataOnPostCall(this.api, postDataWithOwnerID, function (apiRes: ApiResponseModel) {
      this.toastSer.hideOverLay();
      if (apiRes.apistatus.isSuccess && apiRes.response["success"]) {
        if ("agentObjects" in apiRes.response["values"])
          var key = Object.keys(apiRes.response["values"]["agentStatistics"])[0];
        this.groupData = apiRes.response["values"]["agentObjects"];
        if (this.groupData) {
          for (var index = 0; index < this.groupData.length; index++) {
            if (this.groupData[index]["loginName"] == selectedPlayer) {
              this.selectedPlayerIndex = index;
              break;
            }
          }
        }
        this.subLevelData = apiRes.response["values"]["agentStatistics"][key];
      }
      else {
        this.subLevelData = {};
        this.toastSer.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
    }.bind(this));

  }
  getBasicPostData() {
    return {
      'data': {
        "networkBalance": false,
        "subView": true
      }, 'headers': {}
    };

  }

}
