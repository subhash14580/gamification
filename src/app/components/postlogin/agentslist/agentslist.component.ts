import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { appConf } from '../../../../configs/app.config';
import { dataConf } from '../../../../configs/data.config';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-agentslist',
  templateUrl: './agentslist.component.html',
  styleUrls: ['./agentslist.component.css']
})
export class AgentslistComponent implements OnInit {



  customizedCols = ["Revenue Percent"];
  selectedPageNumber: any;
  selectedPageNumberBeforeRequest: any;
  tableInfoText: any = appConf.playersRevenueDataTableResultsText;
  numberOfPages: number;
  headers: any = [];
  rowData: any = [];
  public tdataInfo: any = {};
  public isTableDataRendered: boolean = false;
  private groupsList: any = dataConf.agentsListColGroups;
  private api = environment["api_url"] + environment["get_agentlist_api"];
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

  constructor(private toastser: ToastService, private authSer: AuthService, private utilSer: UtilitiesService) { }

  ngOnInit() {
  }

  changeCurrency(data) {
    this.inputs.currency = data;
  }
  changeReferrer(data) {
    this.inputs.referrer = data;
  }
  changeIncludeAgentstatus() {
    this.inputs.showTree = !this.inputs.showTree;
  }

  getAgentsList(pageNumber, fromSearch?) {

    let modifiedInput = {};
    if (fromSearch) {
      for (var key in this.inputs)
        if (this.inputs[key])
          modifiedInput[key] = this.inputs[key];
    }
    else
      modifiedInput = this.inputs;
    modifiedInput["pageNumber"] = pageNumber;
    const postData = {
      data: modifiedInput,
      headers: {}
    };
    this.selectedPageNumberBeforeRequest = pageNumber;
    console.log(postData);
    this.toastser.showOverLay("Fetching agents list");
    this.authSer.getDataOnPostCall(this.api, postData, this.getAgentListHandler.bind(this));
  }
  getAgentListHandler(data: ApiResponseModel) {
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
  generateTdata(data) {
    this.tdataInfo.tdata = data.response["referredAgentsInfo"];
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
    let tempHeaders;
    let tempRowData = [];
    if (this.tdataInfo.tdata.length > 0) {
      if (this.headers.length > 0)
        tempHeaders = this.headers;
      else {
        tempHeaders = this.utilSer.getHeadersFromGroupList(this.groupsList);
        tempHeaders = tempHeaders.concat(this.customizedCols);
      }
    }
    this.tdataInfo.tdata.forEach((recordObj) => {
      let record = this.utilSer.getSingleRowDataFromGroupList(this.groupsList, recordObj);
      record.push(this.getRevenuePercentColVal(recordObj));
      // if neede custom ize each : add extra col for transfer/reset/lock
      tempRowData.push(record);

    });
    this.headers = tempHeaders;
    this.rowData = tempRowData;
  }
  getRevenuePercentColVal(obj) {
    let str = "";
    str += "Poker : ";
    str += obj["pokerPercent"] ? obj["pokerPercent"] : "NA <br />";
    str += "Casino : ";
    str += obj["casinoPercent"] ? obj["pokerPercent"] : "NA";
    return str;
  }
  nextPage() {
    if (this.selectedPageNumber < this.numberOfPages) {
      this.getAgentsList(this.selectedPageNumber + 1);
    }
  }
  prevPage() {
    if (this.selectedPageNumber > 1) {
      this.getAgentsList(this.selectedPageNumber - 1);
    }
  }
  getListOfValues(noofPages) {
    return this.utilSer.getListOfValues(noofPages);
  }
}
