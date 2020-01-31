import { Component, OnInit } from '@angular/core';
import { appConf } from '../../../../configs/app.config';
import { UtilitiesService } from '../../../../services/utilities.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { dataConf } from '../../../../configs/data.config';

@Component({
  selector: 'app-playersrevenue',
  templateUrl: './playersrevenue.component.html',
  styleUrls: ['./playersrevenue.component.css']
})
export class PlayersrevenueComponent implements OnInit {
  customizedCols = ["Revenue Percent"];
  selectedPageNumber: any = 0;
  selectedPageNumberBeforeRequest: any;
  tableInfoText: any = appConf.playersRevenueDataTableResultsText;
  numberOfPages: number;
  headers: any = [];
  rowData: any = [];
  public tdataInfo: any = {};
  public isTableDataRendered: boolean = false;
  private groupsList: any = dataConf.playersRevenueColGroups;

  gameTypeList = [
    { name: "All", value: "0" },
    { name: "Poker Games", value: "1" },
    { name: "Poker Sit'N'Go", value: "5" },
    { name: "Poker Tournaments", value: "6" },
    { name: "Poker Live Tournaments", value: "7" }
  ]
  public inputs = {
    type: "player",
    from: "",
    currency: appConf.preferredCurrency,
    to: "",
    id: "",
    includeAll: "",
    gameType: "0",
    loginMask: "",
    nickNameMask: "",
    fullNameMask: "",
    groupBy: "",
    isGroupByLogin: "",
    limit: 10,
    offset: 1
  }
  private api: any = environment["api_url"] + environment["get_revenue_from_users"];
  tablePostData: { data: {}; headers: {}; };
  prevInput: {};
  constructor(private utilSer: UtilitiesService,
    private toastSer: ToastService,
    private authSer: AuthService) {
    this.getRevenue(1, true);
  }

  ngOnInit() {
  }
  getRevenue(pageNumber, fromSearch?) {
    // make b y default nulll
    const usedKeys = { from: 1, to: 1, currency: 1, type: 1, limit: 1, offset: 1 }
    let data = {};
    if (fromSearch) {
      for (var key in this.inputs) {
        if (key in usedKeys)
          data[key] = this.inputs[key];
      }
    }
    else
      data = this.prevInput;
    data["offset"] = pageNumber;
    const postData = {
      data: this.utilSer.filterDataObj(data, { to: 1, from: 1, limit: 1 }),
      headers: {}
    }
    this.prevInput = data;
    this.tablePostData = postData;
    this.toastSer.showOverLay("fetching...");
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this))
  }
  handleGameTypeList(apiRes: ApiResponseModel) {
    if ("gameCodeVsData" in apiRes.response) {
      this.gameTypeList = Object.values(apiRes.response["gameCodeVsData"]);
      this.gameTypeList.forEach((record) => {
        if ("selected" in record) {
          this.inputs.gameType = record["num"];
        }
      })
    }
    else
      this.gameTypeList = [];
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        // update tdatainfo 
        // update tdatainfo 
        this.handleGameTypeList(apiRes);
        this.generateTdata(apiRes);
        this.processTableRequiredData();
        this.selectedPageNumber = this.selectedPageNumberBeforeRequest;
        this.isTableDataRendered = true;
      }
      else {
        let tstmsgobj = toastmsgs.register.error;
        "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
        this.toastSer.showToaster(tstmsgobj, "error");
      }
    }
  }
  generateTdata(data) {
    this.tdataInfo.tdata = data.response["referredAgents"];
    if (!this.tdataInfo.tdata)
      this.tdataInfo.tdata = [];
    this.numberOfPages = Math.ceil((data.response["total"] ? data.response.total : 0) / this.inputs.limit);
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
      this.getRevenue(this.selectedPageNumber + 1);
    }
  }
  prevPage() {
    if (this.selectedPageNumber > 1) {
      this.getRevenue(this.selectedPageNumber - 1);
    }
  }
  getListOfValues(noofPages) {
    return this.utilSer.getListOfValues(noofPages);
  }
}
