import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../http/authservices/auth.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-bank-account-info',
  templateUrl: './bank-account-info.component.html',
  styleUrls: ['./bank-account-info.component.css']
})
export class BankAccountInfoComponent implements OnInit {
  private api: any = environment["api_url"] + environment["get_bankaccounts"];
  private delapi: any = environment["api_url"] + environment["delete_bankaccounts"];
  bankaccdetails: any = [];
  selectedBankIndex: any = 0;
  constructor(
    private router: Router, private authSer: AuthService,
    private utilSer: UtilitiesService, private toastSer: ToastService
  ) {
    this.getBankAccounts();

  }
  getBankAccounts() {
    const postData = this.utilSer.getBasePostData();
    this.toastSer.showOverLay();
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));
  }
  dataHandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data.apistatus.isSuccess && data.response.success) {
      console.log(data);
      this.bankaccdetails = data.response.bankAccountInfos;
      if (!this.bankaccdetails)
        this.bankaccdetails = [];
    }
  }
  errorHandlerOnApiRes(data: ApiResponseModel) {
    let tstmsgobj = toastmsgs.register.error;
    "code" in data.response && (tstmsgobj.title = data.response["code"]);
    this.toastSer.showToaster(tstmsgobj, "error");
  }
  ngOnInit() {
  }

  add() {
    this.router.navigate(['/user/addaccinfo']);
  }
  delete(bankEncodedID) {
    const postData = this.utilSer.getBasePostData();
    postData.data["bankEncodedIDs"] = [bankEncodedID];
    this.toastSer.showOverLay("Deleting");
    this.authSer.getDataOnPostCall(this.delapi, postData, this.deleteHandler.bind(this));
  }
  deleteHandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data) {
      if (data.apistatus.isSuccess && data.response.success) {
        this.toastSer.showToaster(toastmsgs.bankaccdeletemsg.success, "success");
        this.getBankAccounts();
      }
      else {
        this.errorHandlerOnApiRes(data);
      }
    }

  }

}
