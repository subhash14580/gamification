import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-verifyplayer',
  templateUrl: './verifyplayer.component.html',
  styleUrls: ['./verifyplayer.component.scss']
})
export class VerifyplayerComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private authSer: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastService, private utilSer: UtilitiesService) { }
  get f() { return this.loginForm.controls; }
  private api = environment["api_url"] + environment["verifyaccount"];
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
      //  captcha: ['', Validators.required]
    });
  }
  verifyplayer() {
    const postData = {
      data: {
        login: this.f.login.value,
        password: this.f.password.value
        //    captcha: Number(this.f.captcha.value)
      }
      ,
      headers: {

      }
    };

    if (this.utilSer.validateFields(this.f)) {
      this.toastrService.showOverLay("Checking");
      this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));
    }
    else {
      this.toastrService.showToaster(toastmsgs.validationError.success, "error");
    }

  }
  dataHandler(data: ApiResponseModel) {
    this.toastrService.hideOverLay();
    if (data) {
      if (data.apistatus.isSuccess && data.response.success) {
        this.toastrService.showToaster(toastmsgs.verifyplayer.success, "success");
      }
      else {
        let msgobj = toastmsgs.login.error;
        msgobj.title = data["response"]["code"];
        this.toastrService.showToaster(msgobj, "error");
      }
    }
  }

}
