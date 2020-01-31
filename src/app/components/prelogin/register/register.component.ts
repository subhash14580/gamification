import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../http/authservices/auth.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { appConf } from '../../../../configs/app.config';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  rgstrBtnEnabled: boolean = false;
  registrationForm: FormGroup;
  errorCode = null;
  countries = [];
  selectCountry = null;
  selectedCampaignType = null;
  isCnfrmPswdMatched: any = "false";
  countriesList: any = [];
  campaignsList: any = [];
  preferredCurrency: any = appConf.preferredCurrency;
  //  isTermsAndConditionsAccepted: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authSer: AuthService, private toastser: ToastService, private utilSer: UtilitiesService) {
    // this.authSer.getCampaignLists(function (campaignLists: any) {
    //   if (campaignLists && campaignLists.length > 0) {
    //     this.campaignsList = campaignLists;
    //     this.selectedCampaignType = this.countriesList[0]["id"];
    //     this.rgstrBtnEnabled = true;
    //   }
    // }.bind(this));
    this.campaignsList = [
      { id: 0, type: "Revenue Share" },
      { id: 1, type: "Cost per Acquisition" },
      { id: 2, type: "Sub Affiliate" }];
    this.selectedCampaignType = "0";
    this.authSer.getCountries(function (apiRes: ApiResponseModel) {
      if (apiRes.apistatus["isSuccess"] && apiRes.response.success) {
        this.countriesList = apiRes.response.values;
        this.selectCountry = this.countriesList[0]["id"];
        this.rgstrBtnEnabled = true;
      }
    }.bind(this));

    // get campaign types and update selectedCampaignType to [0] value 
  }
  get f() { return this.registrationForm.controls; }
  ngOnInit() {

    //this.authSer.register(environment.api_url + environment.getcountries_api, {}, this.countriesHandler.bind(this));
    this.registrationForm = this.formBuilder.group({
      login: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      cnfpassword: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      address: ['', Validators.required],
      campaignName: ['', Validators.required],
      websiteurl: ['', Validators.required],
      isTermsAndConditionsAccepted: [false]
    });
  }

  register() {
    this.errorCode = null;

    const postData = {
      data: {
        login: this.f.login.value,
        nickname: this.f.login.value,
        email: this.f.email.value,
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        password: this.f.password.value,
        currency: this.preferredCurrency,
        address: {
          city: this.f.city.value,
          phone: this.f.phone.value,
          country: this.selectCountry,
          state: this.f.state.value,
          zipCode: this.f.zipCode.value,
          address: this.f.address.value
        },
        campaignName: this.f.campaignName.value,
        websiteURL: this.f.websiteurl.value,
        campaignTypeId: Number(this.selectedCampaignType)


      },
      headers: {

      }
    };
    if (this.utilSer.validateFields(this.f) && this.validateLocalData()) {
      this.toastser.showOverLay("Creating profile :) ");
      this.authSer.register(environment["api_url"] + environment["registration_api"], postData, this.registrationHandler.bind(this));
    }
    else {
      this.toastser.showToaster(toastmsgs.validationError.success, "error");
    }
  }

  validateLocalData() {
    if (this.preferredCurrency.trim().length > 0 &&
      this.selectCountry.trim().length > 0 &&
      this.selectedCampaignType.trim().length > 0)
      return true;
    return false;
  }
  changeCountry(data) {
    this.selectCountry = data;
  }
  countriesHandler(data) {
    this.countries = data.values;
  }
  changeCampaignType(data) {
    this.selectedCampaignType = data;
  }
  verifyConfirmPaswrd($event) {
    if (this.f.password.errors || this.f.password.value != $event.target.value)
      this.isCnfrmPswdMatched = 'false';
    else
      this.isCnfrmPswdMatched = 'true';
    this.f.cnfpassword.setValue($event.target.value);
  }
  handleConfirmPaswrd($event) {
    if (this.f.password.errors || this.f.cnfpassword.value != $event.target.value)
      this.isCnfrmPswdMatched = 'false';
    else
      this.isCnfrmPswdMatched = 'true';
  }
  registrationHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.router.navigate(['/user/statistics']);
          this.toastser.showToaster(toastmsgs.register.success, "success");
        }
        else {
          let tstmsgobj = toastmsgs.register.error;
          "code" in data.response && (tstmsgobj.title = data.response["code"]);
          this.toastser.showToaster(tstmsgobj, "error");
        }
      }
      else {
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg, "error");
      }
    }
  }
}
