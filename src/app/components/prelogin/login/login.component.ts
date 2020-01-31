import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { HttpHeaders } from '@angular/common/http';
import { appConf } from '../../../../configs/app.config';
import { HttpconnectService } from '../../../http/authservices/httpconnect.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { CookiemanagerService } from '../../../../services/cookiemanager.service';
import { DatamanagerService } from '../../../../services/datamanager.service';
import { UtilitiesService } from '../../../../services/utilities.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private imageBlobUrl: any = "";
  constructor(private router: Router, private authSer: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastService,
    private dataMngrSer: DatamanagerService,
    private utilSer: UtilitiesService) {
    // const captchainfodata = this.dataMngrSer.getCaptchaData();
    // if (captchainfodata) {
    //   const finalAPiResModel = new ApiResponseModel();
    //   finalAPiResModel.setApiStatus({ "isSuccess": true });
    //   finalAPiResModel.response = captchainfodata;
    //   this.captchaHandler(finalAPiResModel);
    // } else {
    //   this.generateCaptcha();
    // }

  }
  get f() { return this.loginForm.controls; }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    //  captcha: ['', Validators.required]
    });
  }


  navigate(path) {
    this.router.navigate([path]);
  }

  login() {
    const postData = {
      data: {
        login: this.f.login.value,
        password: this.f.password.value,
    //    captcha: Number(this.f.captcha.value)
      }
      ,
      headers: {

      }
    };

    if (this.utilSer.validateFields(this.f)) {
      this.toastrService.showOverLay("Checking");
      this.authSer.login(environment["api_url"] + environment["login_api"], postData, this.loginHandler.bind(this));
    }
    else {
      this.toastrService.showToaster(toastmsgs.validationError.success, "error");
    }
  }

  loginHandler(data) {

    this.toastrService.hideOverLay();
    if (data.success) {
      this.toastrService.showToaster(toastmsgs.login.success, "success");
      this.router.navigate(['/user/gamezone']);
    } else {
      let msgobj = toastmsgs.login.error;
      msgobj.title = data["code"];
      // msgobj.msg = data["description"];

      this.toastrService.showToaster(msgobj, "error");
      //this.generateCaptcha();
    }
  }
  generateCaptcha() {
    const postData = {
      data: {

      },
      headers: this.getHeaders()
    }
    this.toastrService.showOverLay("Fetching captcha");
    this.authSer.getDataOnBlobPostCall(environment["api_url"] + environment["get_captcha"], postData, this.captchaHandler.bind(this))

  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageBlobUrl = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  captchaHandler(apiRes: ApiResponseModel) {
    this.toastrService.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      this.createImageFromBlob(apiRes.response);
      this.dataMngrSer.setCaptchaData(apiRes.response);


    } else {
      this.toastrService.showToaster(toastmsgs.captchaError.success, "error");
    }
  }
  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'siteid': appConf.siteId

    });
  }

}
