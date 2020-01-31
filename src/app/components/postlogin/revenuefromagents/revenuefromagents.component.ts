import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { appConf } from '../../../../configs/app.config';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { dataConf } from '../../../../configs/data.config';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-revenuefromagents',
  templateUrl: './revenuefromagents.component.html',
  styleUrls: ['./revenuefromagents.component.css']
})
export class RevenuefromagentsComponent implements OnInit {

  customizedCols = ["Revenue Percent"];
  selectedPageNumber: any = 0;
  selectedPageNumberBeforeRequest: any;
  tableInfoText: any = appConf.playersRevenueDataTableResultsText;
  numberOfPages: number;
  headers: any = [];
  rowData: any = [];
  public tdataInfo: any = {};
  public isTableDataRendered: boolean = false;
  public groupsList: any = dataConf.agentsRevenueColGroups;
  public groupByOps: any = dataConf.agentsRevenueGroupByOps;

  public inputs = {
    type: "player",
    fromdate: "",
    currency: appConf.preferredCurrency,
    todate: "",
    id: "",
    includeAll: "",
    loginMask: "",
    fullNameMask: "",
    groupBy: "",
    isGroupByLogin: "",
    limit: 10,
    offset: 1,
    rp: 10
  }

  prevInput: {};
  tablePostData: { data: {}; headers: {}; };
  private api: any = environment["api_url"] + environment["get_revenue_from_users"];

  constructor(private utilSer: UtilitiesService,
    private toastSer: ToastService,
    private authSer: AuthService) {
    this.inputs.groupBy = this.groupByOps[0]["value"];
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
      data: this.utilSer.filterDataObj(data, { to: 1, from: 1 }),
      headers: {}
    }
    this.prevInput = data;
    this.tablePostData = postData;
    this.toastSer.showOverLay("fetching...");
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this))
  }

  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        // update tdatainfo 

        // update tdatainfo 
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
    this.numberOfPages = Math.ceil((data.response["total"] ? data.ga.total : 0) / this.inputs.limit);
  }
  processTableRequiredData() {
    let tempHeaders = [];
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
