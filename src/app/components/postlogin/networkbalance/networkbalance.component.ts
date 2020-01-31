import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';

@Component({
  selector: 'app-networkbalance',
  templateUrl: './networkbalance.component.html',
  styleUrls: ['./networkbalance.component.css']
})
export class NetworkbalanceComponent implements OnInit {
  networkblncData: any = {};
  subLevelData: any = {};
  private postData: any = {
    'data': {
      "networkBalance": true,
      "subView": true
    }, 'headers': {}
  };
  public isBalanceCallCompleted = false;
  public isApiFailed: boolean = false;
  private api = environment["api_url"] + environment["getNetworkbalance_api"];
  constructor(private authSer: AuthService, private toastSer: ToastService, private router: Router, private route: ActivatedRoute) {
    this.toastSer.showOverLay();
    this.authSer.getDataOnPostCall(this.api, this.postData, (apiRes: ApiResponseModel) => {
      console.log(apiRes);
      if (apiRes.apistatus.isSuccess) {
        if (apiRes.response["success"]) {
          const data = apiRes.response["values"]["agentNetworkStats"];
          const keys = Object.keys(data);
          if (keys.length > 0) {
            this.subLevelData = data[keys[0]];
          }
          this.isApiFailed = false;
          this.isBalanceCallCompleted = true;
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
      this.isBalanceCallCompleted = true;
      this.toastSer.hideOverLay();
    });
  }

  ngOnInit() {
  }

}
