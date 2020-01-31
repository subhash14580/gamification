import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-forgotpwsd',
  templateUrl: './forgotpwsd.component.html',
  styleUrls: ['./forgotpwsd.component.css']
})
export class ForgotpwsdComponent implements OnInit {
  basicForm: FormGroup;
  public btnClicked: boolean = false;
  errorCode = null;
  constructor(private formBuilder: FormBuilder, private authSer: AuthService, private toastSer: ToastService) { }
  get f() { return this.basicForm.controls; }
  ngOnInit() {
    this.basicForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required]
    });
  }
  resetPassword() {
    if (this.f.username.value.trim().length == 0 || this.f.email.value.trim().length == 0) {
      this.toastSer.showToaster(toastmsgs.validationError.success, "error");
      return;
    }
    this.errorCode = null;
    const postData = {
      data: {
        login: this.f.username.value,
        email: this.f.email.value,
      },
      headers: {

      }
    };
    this.toastSer.showOverLay();
    this.authSer.resetLink(environment["api_url"] + environment["forgotpassword_api"], postData, this.resetPasswordHandler.bind(this));
  }
  resetPasswordHandler(apiResModel: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiResModel.apistatus.isSuccess) {
      if (apiResModel.response.success) {
        this.toastSer.showToaster(toastmsgs.resetpassword.success, "info");
      }
      else {
        const tstmsg = toastmsgs.resetpassword.error;
        tstmsg.title = apiResModel.response.code;
        this.toastSer.showToaster(tstmsg, "error");
      }
    }
    else {
      this.toastSer.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
    }
  }


}
