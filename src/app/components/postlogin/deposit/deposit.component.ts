import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../http/authservices/auth.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  balance: any = null;
  depositForm: FormGroup;
  errorCode = null;
  defaultCurrency = environment.default_currency;

  constructor(
    private formBuilder: FormBuilder,
    private authSer: AuthService, private utilSer: UtilitiesService, private toastSer: ToastService) { }
  get f() { return this.depositForm.controls; }
  ngOnInit() {
    // const postData = this.utilSer.getBasePostData();
    // this.toastSer.hideOverLay();
    //this.authSer.getDataOnPostCall(environment.api_url + environment.getpayment_systems_api, postData, this.paymentSystemsHandler.bind(this));
    this.depositForm = this.formBuilder.group({
      amount: [0, Validators.required]
    });
    // this.loadBalance();
  }

  paymentSystemsHandler(data: ApiResponseModel) {
    // data = data.response;
    // if (data["success"]) {
    //   window.alert(JSON.stringify(data));
    // } else {
    //   window.alert(JSON.stringify(data));
    // }
    console.log(data);
  }

  loadBalance() {
    const postData = this.utilSer.getBasePostData();
    this.toastSer.showOverLay();
    this.authSer.getDataOnPostCall(environment.api_url + environment.getbalance_api, postData, this.balanceHandler.bind(this));
  }
  balanceHandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data && data.apistatus.isSuccess) {
      if (data.response.success) {
        this.balance = null;
        for (let index = 0; index < data.response.values.length; index++) {
          const balance = data.response.values[index];
          if (balance.wallet.name === this.defaultCurrency) {
            this.balance = balance;
          }
        }
      } else {
        this.errorHandlerOnApiRes(data);
      }

    }
  }
  errorHandlerOnApiRes(data: ApiResponseModel) {
    let tstmsgobj = toastmsgs.register.error;
    "code" in data.response && (tstmsgobj.title = data.response["code"]);
    this.toastSer.showToaster(tstmsgobj, "error");
  }

  deposit() {
    if (this.f.amount.value <= 0) {
      this.toastSer.showToaster(toastmsgs.depositamountgreaterthanzero.success, "error");
      return;
    }
    this.errorCode = null;
    const postData = this.utilSer.getBasePostData();
    postData.data = {
      amount: this.f.amount.value,
      comments: 'test by d',
      paymentSystem: environment.default_gateway
    };
    this.toastSer.showOverLay("Depositing ...");
    this.authSer.getDataOnPostCall(environment.api_url + environment.deposit_api, postData, this.depositHandler.bind(this));
  }

  depositHandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data && data.apistatus.isSuccess && data.response.success) {
      this.toastSer.showToaster(toastmsgs.successmsg.success, "success");
      let redirectionurl = data.response["redirectionUrl"];
      this.toastSer.showModal(redirectionurl);
      // will get a url and should show in modal 
    }
    else {
      this.errorHandlerOnApiRes(data);
    }

    //  this.loadBalance();
  }
}
