import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../http/authservices/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';
import { environment } from '../../../../environments/environment';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { appConf } from '../../../../configs/app.config';

@Component({
  selector: 'app-createplayer',
  templateUrl: './createplayer.component.html',
  styleUrls: ['./createplayer.component.css']
})
export class CreateplayerComponent implements OnInit {
  playerForm: FormGroup;
  playerPersonalInfoForm: FormGroup
  selectCountry = "";
  selectCurrency = "INR";
  errorCode = null;
  btnEnabled : boolean = false;
  countriesList: any = [];
  isCnfrmPswdMatched: boolean = false;
  preferredCurrency: any = appConf.preferredCurrency;
  constructor(private router: Router, private authSer: AuthService, private formBuilder: FormBuilder,
    private toastser: ToastService) {
    this.authSer.getCountries(function (apiRes: ApiResponseModel) {
      if (apiRes.apistatus["isSuccess"] && apiRes.response.success) {
        this.countriesList = apiRes.response.values;
        this.selectCountry = this.countriesList[0]["id"];
        this.btnEnabled = true;
      }
    }.bind(this));
  }
  get f() { return this.playerForm.controls; }
  get k() { return this.playerPersonalInfoForm.controls; }
  ngOnInit() {
    this.playerForm = this.formBuilder.group({
      login: ['', Validators.required],
      nickname: ['', Validators.required],
      password: ['', Validators.required],
      cnfpassword: ['', Validators.required],
      initailBlncA: ['', Validators.required],
      initailBlncB: ['', Validators.required]

    });

    this.playerPersonalInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      currency: ['', Validators.required],
      zipCode: ['', Validators.required],
      bday: ['', Validators.required],
      scrtqstn: ['', Validators.required],
      scrtanswr: ['', Validators.required],
    });

  }
  changeCountry(data) {
    this.selectCountry = data;
  }
  changeCurrency(data) {
    this.selectCurrency = data;
  }

  createplayer() {
    this.errorCode = null;
    let M, D, Y;
    // split bday 
    if (this.k.bday.value.length == 0) {
      this.toastser.showToaster(toastmsgs.validationError.success, "error");
      return;
    }
    [Y, M, D] = this.k.bday.value.split("-");
    const initBalnc = this.f.initailBlncA.value + Number("0." + String(this.f.initailBlncB.value));
    const postData = {
      data: {
        login: this.f.login.value,
        nickname: this.f.login.value,
        password: this.f.password.value,
        currency: this.selectCurrency,
        initialBalance: initBalnc,
        email: this.k.email.value,
        firstName: this.k.firstname.value,
        lastName: this.k.lastname.value,
        birthday: {
          year: Number(Y),
          month: Number(M),
          day: Number(D)
        },
        address: {
          city: this.k.city.value,
          phone: this.k.phone.value,
          country: this.selectCountry,
          zipCode: this.k.zipCode.value,
          state: this.k.state.value,
          address: this.k.address.value
        },
        secretQuestion: this.k.scrtqstn.value,
        secretAnswer: this.k.scrtanswr.value
      },
      headers: {

      }
    };

    this.toastser.showOverLay("Work in progress...");
    this.authSer.getDataOnPostCall(environment["api_url"] + environment["create_player_api"], postData, this.playerCreationHandler.bind(this));
  }
  playerCreationHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.toastser.showToaster(toastmsgs.createPlayer.success, "success");
          this.playerForm.reset();
          this.playerPersonalInfoForm.reset();
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
