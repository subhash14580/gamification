import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  mainPay: any = 0; subPay: any = 0;
  inputs: any = {
    userId: "",
    subUser: "player",
    amount: 0,
    frac: 0,
    id: null,
    fromTo: "to",
    currency: "INR",
    creditOperation: "",
  }
  playersList: any = [];
  private api: any = environment["api_url"] + environment["transfer_amount"];

  constructor(private utilSer: UtilitiesService,
    private authSer: AuthService, private toastSer: ToastService, private toastser: ToastService) {
    this.getPlayersList();
  }

  ngOnInit() {
  }
  transfer() {
    if (this.inputs.data["amount"] == 0) {
      this.toastSer.showToaster(toastmsgs.depositamountgreaterthanzero.success, "info");
      return;
    }
    if (Object.keys(this.utilSer.filterDataObj(this.inputs, { id: 1, creditOperation: 1 })).length < 6) {
      this.toastSer.showToaster(toastmsgs.validationError.success, "error");
      return;
    }

    const postData = this.utilSer.getBasePostData();
    postData.data = this.inputs;
    // modify frac and m=amount to strings 
    postData.data["amount"] = String(postData.data["amount"]);
    postData.data["frac"] = String(postData.data["frac"]);
    //  postData.data = this.utilSer.filterDataObj(postData.data);
    this.toastSer.showOverLay("Transaction in progress..")
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));

  }
  dataHandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data) {
      if (data.apistatus.isSuccess && data.response.success) {
        this.toastSer.showToaster(toastmsgs.transfersuccess.success, "success");
      }
      else {
        this.errorHandlerOnApiRes(data);
      }
    }
  }
  errorHandlerOnApiRes(data: ApiResponseModel) {
    let tstmsgobj = toastmsgs.simpleAPiErrormsg.success;
    "code" in data.response && (tstmsgobj.title = data.response["code"]);
    this.toastSer.showToaster(tstmsgobj, "error");
  }
  getPlayersList() {
    let input = {
      currency: "INR",
      status: -1,
      pageNumber: 1,
      rowsPerPage: 10
    }
    const postData = {
      data: input,
      headers: {}
    };
    const playerlistapi = environment["api_url"] + environment["get_playerslist_api"];
    this.toastser.showOverLay("Fetching players amounts");
    this.authSer.getDataOnPostCall(playerlistapi, postData, this.getPlayersListHandler.bind(this));

  }
  getPlayersListHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.playersList = data.response["playerObjects"];
          if (!this.playersList)
            this.playersList = [];
        }
        else {
          this.errorHandlerOnApiRes(data);
        }
      }
      else {
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
    }
  }


}
