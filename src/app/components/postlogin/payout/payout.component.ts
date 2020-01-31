import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { UtilitiesService } from '../../../../services/utilities.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {
  paymentgatewayList = [
    { id: 126, value: "WisPay" },
    { id: 117, value: "PerfectMoney" },
    { id: 121, value: "CoinPayments" }
  ];
  selectedPayment: any = 126;
  amount: any = 0;
  private api: any = environment["api_url"] + environment["withdraw"];
  constructor(private authSer: AuthService,
    private toastSer: ToastService,
    private utilSer: UtilitiesService) { }
  public inputs: any = {
    availableForPayout: null,
    payoutAmount: null,
    accountnumber: null,
    accounttype: null,
    cardnumber: null
  }

  ngOnInit() {
  }

  payout() {
    if (this.amount <= 0) {
      this.toastSer.showToaster(toastmsgs.depositamountgreaterthanzero.success, "error");
      return;
    }
    const postData = this.utilSer.getBasePostData();
    postData.data["amount"] = this.amount;
    this.toastSer.showOverLay("Payout in progress");
    this.authSer.getDataOnPostCall(this.api, postData, this.datahandler.bind(this));


  }
  datahandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data) {
      if (data.apistatus.isSuccess && data.response.success) {
        this.toastSer.showToaster(toastmsgs.payoutsuccess.success, "success");
      }
      else
        this.errorHandlerOnApiRes(data);
    }
  }
  errorHandlerOnApiRes(data: ApiResponseModel) {
    let tstmsgobj = toastmsgs.register.error;
    "code" in data.response && (tstmsgobj.title = data.response["code"]);
    this.toastSer.showToaster(tstmsgobj, "error");
  }


}
