import { Component, OnInit } from '@angular/core';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { post } from 'selenium-webdriver/http';
import { environment } from '../../../../environments/environment';
import { appConf } from '../../../../configs/app.config';
import { dataConf } from '../../../../configs/data.config';
import { UtilitiesService } from '../../../../services/utilities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.css']
})
export class PlayerslistComponent implements OnInit {
  selectedPageNumber: any;
  selectedPageNumberBeforeRequest: any;
  tableInfoText: any = appConf.playersRevenueDataTableResultsText;
  numberOfPages: number;
  private lockunlockapi = environment["api_url"] + environment["unlockLockForSubUser"];
  constructor(
    private toastser: ToastService,
    private authSer: AuthService,
    private utilSer: UtilitiesService,
    private route: Router) { }
  headers: any = [];
  rowData: any = [];
  opsCol: any = [];
  public tdataInfo: any = {};
  public isTableDataRendered: boolean = false;
  private api = environment["api_url"] + environment["get_playerslist_api"];
  private resetSubUserPswdApi: any = environment["api_url"] + environment["resetPasswordForSubUser"];
  private type: any = "player";
  private prevInput: any = {};
  private groupsList: any = dataConf.playersListColGroups;
  public inputs: any = {
    currency: appConf.preferredCurrency,
    login: null,
    email: null,
    nickName: null,
    firstName: null,
    lastName: null,
    fullName: null,
    status: -1,
    pageNumber: 1,
    rowsPerPage: 10,
    showTree: false,
    affiliateId: null,
    debitFilter: null

  }
  ngOnInit() {
  }
  changeCurrency(data) {
    this.inputs.currency = data;
  }
  changeReferrer(data) {
    this.inputs.referrer = data;
  }
  changePlayerstatus(data) {
    this.inputs.status = Number(data);
  }
  changeshowTreestatus() {
    this.inputs.showTree = !this.inputs.showTree;
  }

  getPlayersList(pageNumber, fromSearch?) {
    let modifiedInput = {};
    if (fromSearch) {
      for (var key in this.inputs)
        if (this.inputs[key])
          modifiedInput[key] = this.inputs[key];
    }
    else
      modifiedInput = this.prevInput;
    modifiedInput["pageNumber"] = pageNumber;
    const postData = {
      data: modifiedInput,
      headers: {}
    };
    this.prevInput = modifiedInput;
    this.toastser.showOverLay("Fetching players list");
    this.selectedPageNumberBeforeRequest = pageNumber;
    this.authSer.getDataOnPostCall(this.api, postData, this.getPlayersListHandler.bind(this));

  }
  getPlayersListHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          // update tdatainfo 
          this.generateTdata(data);
          this.processTableRequiredData();
          this.selectedPageNumber = this.selectedPageNumberBeforeRequest;
          this.isTableDataRendered = true;
        }
        else {
          this.errorHandlerOnApiRes(data);
        }
      }
      else {
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg.success, "error");
      }
    }
  }
  generateTdata(data) {
    this.tdataInfo.tdata = data.response["playerObjects"];
    if (!this.tdataInfo.tdata)
      this.tdataInfo.tdata = [];
    this.numberOfPages = Math.ceil((data.response["total"] ? data.response.total : 0) / this.inputs.rowsPerPage);
    // this.tdataInfo.api = this.api;
    // this.tdataInfo.postData = this.tablePostData;
    // this.tdataInfo.pageNumberKey = "pageNumber"
    // this.tdataInfo.tableInfoText = appConf.transactionResultsInfoTextKey;
    // this.tdataInfo.searchCriteriaKey = "playerObjects";
    // this.tdataInfo.neglectedCols = this.hideCols;
    // this.tdataInfo.total = data.response["total"];
  }
  processTableRequiredData() {
    let tempHeaders = [];
    let tempRowData = [];
    let tempOps = [];
    if (this.tdataInfo.tdata.length > 0) {
      if (this.headers.length > 0)
        tempHeaders = this.headers;
      else
        tempHeaders = this.utilSer.getHeadersFromGroupList(this.groupsList);
    }
    this.tdataInfo.tdata.forEach((recordObj) => {
      let record = this.utilSer.getSingleRowDataFromGroupList(this.groupsList, recordObj);
      tempOps.push(recordObj);
      tempRowData.push(record);
      // if neede custom ize each : add extra col for transfer/reset/lock
    });
    this.headers = tempHeaders;
    this.rowData = tempRowData;
    this.opsCol = tempOps;
  }
  nextPage() {
    if (this.selectedPageNumber < this.numberOfPages) {
      this.getPlayersList(this.selectedPageNumber + 1);
    }
  }
  prevPage() {
    if (this.selectedPageNumber > 1) {
      this.getPlayersList(this.selectedPageNumber - 1);
    }
  }
  getListOfValues(noofPages) {
    return this.utilSer.getListOfValues(noofPages);
  }

  // Ops cloumn functions
  transfer(path) {
    this.route.navigate([path]);

  }
  lockUnlock(loginName, referrerLogin, i) {
    const postData = this.utilSer.getBasePostData();
    postData.data["loginName"] = loginName;
    postData.data["type"] = "player";
    postData.data["referrerLogin"] = referrerLogin;
    this.toastser.showOverLay();
    this.authSer.getDataOnPostCall(this.lockunlockapi, postData, function (data: ApiResponseModel) {
      if (data) {
        this.toastser.hideOverLay();
        if (data.apistatus.isSuccess && data.response.success) {
          this.toastser.showToaster(toastmsgs.successmsg.success, "success");
          this.opsCol[i].status = this.opsCol[i].status.toLowerCase() == 'active' ? 'locked' : 'active';
        }
        else
          this.errorHandlerOnApiRes(data);
      }
    }.bind(this))
  }
  resetPswd(loginName) {
    const postData = this.utilSer.getBasePostData();
    postData.data["type"] = this.type;
    postData.data["loginName"] = loginName;
    this.toastser.showOverLay();
    this.authSer.getDataOnPostCall(this.resetSubUserPswdApi, postData, function (data: ApiResponseModel) {
      if (data) {
        this.toastser.hideOverLay();
        if (data.apistatus.isSuccess && data.response.success) {
          this.toastser.showModal(this.passwordResetTextForSubUser(postData.data["loginName"], data.response.password));
          this.toastser.showToaster(toastmsgs.resetPswdForSubUsr.success, "success");
        }
        else
          this.errorHandlerOnApiRes(data);
      }
      else {
        this.toastser.showToaster(toastmsgs.noDataError.success, "error");
      }
    }.bind(this));

  }

  passwordResetTextForSubUser(loginName, password) {
    return "Password for " + loginName + " user : " + password;
  }

  errorHandlerOnApiRes(data: ApiResponseModel) {
    let tstmsgobj = toastmsgs.register.error;
    "code" in data.response && (tstmsgobj.title = data.response["code"]);
    this.toastser.showToaster(tstmsgobj, "error");
  }

}
