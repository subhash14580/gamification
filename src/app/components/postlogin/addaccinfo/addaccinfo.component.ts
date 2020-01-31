import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';

@Component({
  selector: 'app-addaccinfo',
  templateUrl: './addaccinfo.component.html',
  styleUrls: ['./addaccinfo.component.css']
})
export class AddaccinfoComponent implements OnInit {
  num: string;
  acctype: string;
  accnum: string;
  public inputs: any = {
    "bankAccountNumber": null,
    "bankName": null,
    "accountBranchName": null,
    "nameOnAccount": null,
    "accountType": null,
    "personalNumber": null
  }


  private api: any = environment["api_url"] + environment["add_bankaccount"];

  constructor(
    private utilservice: UtilitiesService,
    private toastservice: ToastService,
    private authservice: AuthService,
    private toastSer: ToastService
  ) { }

  ngOnInit() {
  }
  addbankaccinfo() {
    const postData = this.utilservice.getBasePostData();
    postData.data = this.utilservice.filterDataObj(this.inputs);
    if (Object.keys(postData.data).length == 6) {
      this.toastSer.showOverLay("Creation in progress")
      this.authservice.getDataOnPostCall(this.api, postData, this.datahandler.bind(this));

    }
    else {
      this.toastservice.showToaster(toastmsgs.validationError.success, "error");
    }
  }
  datahandler(data: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (data) {
      if (data.apistatus.isSuccess && data.response.success) {
        this.toastSer.showToaster(toastmsgs.BankAccountSuccess.success, "success");
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

}
