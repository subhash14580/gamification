import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { DatamanagerService } from '../../../../services/datamanager.service';
import { CookiemanagerService } from '../../../../services/cookiemanager.service';
import { appConf } from '../../../../configs/app.config';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorCode = null;
  countriesList = [];
  selectCountry = "";
  enableEditPassword: boolean = false;
  preferredCurrency = appConf.preferredCurrency;
  public isBalanceCallCompleted: boolean = false;
  public isApiFailed: boolean = false;
  public oldPassword: any = "";
  public newPassword: any = "";
  btnEnabled: boolean = false;
  private user_data: any = null;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private authSer: AuthService, private toastser: ToastService,
    private cookieService: CookiemanagerService,
    private datamngrSer: DatamanagerService,
    private utilSer: UtilitiesService) {
    const user_data_from_cookie = this.cookieService.getCookie(appConf.Userdatakeyforcookie);
    // if (user_data_from_cookie["isDataExists"]) {
    //   this.user_data = JSON.parse(user_data_from_cookie["data"]);
    //   this.generateView();
    //   this.isBalanceCallCompleted = true;
    // }
    // else {
    //   this.getDataOnProfileCall();
    // }
    this.getDataOnProfileCall();

  }
  get f() { return this.profileForm.controls; }
  ngOnInit() {

  }
  getDataOnProfileCall() {
    const payLoad = this.authSer.getBasicPayLoad();
    const wsession = this.cookieService.getJsessionCookie()["data"];
    if (!wsession)
      this.authSer.logout();
    else {
      this.toastser.showOverLay("Fetching profile....");
      payLoad.headers = this.authSer.getHeadersForProfileCall(wsession);
      this.authSer.getProfileCall(payLoad, (profileDataResponse) => {
        this.toastser.hideOverLay();
        if (profileDataResponse.success) {
          this.datamngrSer.setUserData(profileDataResponse);
          this.cookieService.setCookie(appConf.Userdatakeyforcookie, JSON.stringify(profileDataResponse));
          this.user_data = profileDataResponse;
          this.generateView();
          this.isBalanceCallCompleted = true;
        }
        else {
          this.isApiFailed = true;
        }
      }
      );
    }

  }
  getCountries() {
    this.authSer.getCountries(function (apiRes: ApiResponseModel) {
      if (apiRes.apistatus["isSuccess"] && apiRes.response.success) {
        this.countriesList = apiRes.response.values;
        this.selectCountry = this.countriesList[0]["id"];
        if (this.f.country.value == '' || Number(this.f.country.value) < 0) {
          this.f.country.setValue(this.selectCountry)
        }

        this.btnEnabled = true;
      }
    }.bind(this));
  }
  updatePswd() {
    if (this.f.oldPassword.errors || this.f.newPassword.errors) {
      this.toastser.showToaster(toastmsgs.validationErrorForPasswordUpdation.success, "error");
      return;
    }
    const postData = {
      data: {
        oldPassword: this.f.oldPassword.value,
        newPassword: this.f.newPassword.value
      },
      headers: {

      }
    }
    this.toastser.showOverLay("Updating password");
    this.authSer.getDataOnPostCall(environment["api_url"] + environment["updatepassword_api"], postData, function (apiRes: ApiResponseModel) {
      this.toastser.hideOverLay();
      if (apiRes.apistatus.isSuccess) {
        if (apiRes.response.success) {
          this.toastser.showToaster(toastmsgs.passwordupdation.success, "success");
        }
        else {
          let tstmsgobj = toastmsgs.register.error;
          "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
          this.toastser.showToaster(tstmsgobj, "error");
        }

      }
      else {
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
    }.bind(this))


  }
  generateView() {

    this.profileForm = this.formBuilder.group({
      login: [{ value: this.user_data["login"] != null ? this.user_data["login"] : '', disabled: true }, Validators.required],
      email: [this.user_data["email"] != null ? this.user_data["email"] : '', Validators.required],
      firstName: [this.user_data["firstName"] != null ? this.user_data["firstName"] : '', Validators.required],
      lastName: [this.user_data["lastName"] != null ? this.user_data["lastName"] : '', Validators.required],
      phone: [this.user_data["address"]["phone"] != null ? this.user_data["address"]["phone"] : '', Validators.required],
      city: [this.user_data["address"]["city"] != null ? this.user_data["address"]["city"] : '', Validators.required],
      country: [this.user_data["address"]["country"] != null ? this.user_data["address"]["country"] : '', Validators.required],
      postal: [this.user_data["address"]["zipCode"] != null ? this.user_data["address"]["postal"] : '', Validators.required],
     // bday: [this.user_data["address"]["birthday"] != null ? this.user_data["address"]["birthday"] : '', Validators.required],
      state: [this.user_data["address"]["state"] != null ? this.user_data["address"]["state"] : '', Validators.required],
      address: [this.user_data["address"]["address"] != null ? this.user_data["address"]["address"] : '', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.getCountries();

  }
  saveprofile() {
    this.errorCode = null;
    // let M = null, D = null, Y = null;
    // // split bday 
    // if (this.f.bday.value.length != 0) {
    //   [Y, M, D] = this.f.bday.value.split("-");
    //   Y = Number(Y);
    //   M = Number(M);
    //   D = Number(D);
    // }

    const postData = {
      data: {
        email: this.f.email.value,
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        nickname: this.f.login.value,
       // language: appConf.languageForProfile,
       // currency: this.preferredCurrency,
        address: {
          city: this.f.city.value,
          phone: this.f.phone.value,
          country: this.selectCountry,
          zipCode: this.f.postal.value,
          address: this.f.address.value,
          state: this.f.state.value
        }
      },
      headers: {

      }
    };
    // if (Y && D && M) {
    //   postData.data["birthday"] = {
    //     year: Y,
    //     month: M,
    //     day: D
    //   };
    // }
    // for (var key in postData["data"]) {
    //   if (postData.data[key] == "")
    //     postData.data[key] = null;
    // }
    // if (this.utilSer.validateFields(this.f, { oldPassword: 1, newPassword: 1 }) && this.validateLocalData()) {
      this.toastser.showOverLay("Saving");
      this.authSer.getDataOnPostCall(environment["api_url"] + environment["updateprofile_api"], postData, this.profileHandler.bind(this));
    // }
    // else {
    //   this.toastser.showToaster(toastmsgs.validationError.success, "error");
    // }

  }

  changeCountry(data) {
    this.selectCountry = data;
  }
  validateLocalData() {
    if (this.preferredCurrency.trim().length > 0 && this.selectCountry.trim().length > 0)
      return true;
    return false;
  }
  profileHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();
    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.toastser.showToaster(toastmsgs.saveprofile.success, "success");
          // this.user_data = data.response;
          // this.generateView();
        }
        else {
          let tstmsgobj = toastmsgs.register.error;
          "code" in data.response && (tstmsgobj.title = data.response["code"]);
          this.toastser.showToaster(tstmsgobj, "error");
        }
      }
      else {
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
    }
  }

}
