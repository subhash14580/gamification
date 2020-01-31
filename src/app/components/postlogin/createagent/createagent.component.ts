import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { appConf } from '../../../../configs/app.config';

@Component({
  selector: 'app-createagent',
  templateUrl: './createagent.component.html',
  styleUrls: ['./createagent.component.css']
})
export class CreateagentComponent implements OnInit {

  revenuePayout: any = 0;
  revenuePayoutps: any = 0;
  agentInformation: FormGroup;
  agentPersonalInfoForm: FormGroup;
  selectCountry: any = "";
  selectCurrency = "INR";
  isCnfrmPswdMatched: boolean = false;
  preferredCurrency: any = appConf.preferredCurrency;
  countriesList: any = [];
  btnEnabled: boolean = false;

  get f() { return this.agentInformation.controls; }
  get k() { return this.agentPersonalInfoForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authSer: AuthService, private toastser: ToastService) {
    this.authSer.getCountries(function (apiRes: ApiResponseModel) {
      if (apiRes.apistatus["isSuccess"] && apiRes.response.success) {
        this.countriesList = apiRes.response.values;
        this.selectCountry = this.countriesList[0]["id"];
        this.btnEnabled = true;
      }
    }.bind(this));
  }

  ngOnInit() {
    this.agentInformation = this.formBuilder.group({
      username: ['', Validators.required],
      nickname: ['', Validators.required],
      password: ['', Validators.required],
      cnfpassword: ['', Validators.required],
      initialbalanceA: ['', Validators.required],
      initialbalanceB: ['', Validators.required]
    });
    this.agentPersonalInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required]
    })
  }


  changeCountry(data) {
    this.selectCountry = data;
  }
  changeCurrency(data) {
    this.selectCurrency = data;
  }

  createagent() {
    const postData = {
      data: {
        login: this.f.username.value,
        nickname: this.f.nickname.value,
        password: this.f.password.value,
        currency: this.selectCurrency,
        email: this.k.email.value,
        firstName: this.k.firstname.value,
        lastName: this.k.lastname.value,
        address: {
          city: this.k.city.value,
          phone: this.k.phone.value,
          country: this.selectCountry,
          zipCode: this.k.zipCode.value,
          state: this.k.state.value,
          address: this.k.address.value
        },
        pokerPercent: this.revenuePayout + Number("0." + String(this.revenuePayoutps))
      },
      headers: {

      }
    };
    console.log(postData);
    this.toastser.showOverLay("work in progress ");
    this.authSer.getDataOnPostCall(environment["api_url"] + environment["registration_api"], postData, this.agentCreationHandler.bind(this));
  }
  agentCreationHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.toastser.showToaster(toastmsgs.createAgent.success, "success");
          this.agentInformation.reset();
          this.agentPersonalInfoForm.reset();
          this.f.cnfpassword.setValue("");
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
  verifyConfirmPaswrd($event) {
    if (this.f.password.errors || this.f.password.value != $event.target.value)
      this.isCnfrmPswdMatched = false;
    else
      this.isCnfrmPswdMatched = true;
    this.f.cnfpassword.setValue($event.target.value);
  }
  handleConfirmPaswrd($event) {
    if (this.f.password.errors || this.f.cnfpassword.value != $event.target.value)
      this.isCnfrmPswdMatched = false;
    else
      this.isCnfrmPswdMatched = true;
  }

}
