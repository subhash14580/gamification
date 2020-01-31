import { Component, OnInit } from '@angular/core';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-campstats',
  templateUrl: './campstats.component.html',
  styleUrls: ['./campstats.component.css']
})
export class CampstatsComponent implements OnInit {

  paymentHistoryObjectsKeys = ["date", "hits", "referredPlayers", "referredWMs", "total", "paidAmount", "reversedAmount", "state"]
  dateData: any = [];
  selectedIndex: any = 0;
  isTableDataRendered: boolean = false;
  rowData: any = [];
  private api = environment["api_url"] + environment["campaignstats"];
  tableData: any[];
  tableOptions: any = ["CPA", "Revenue Share", "Sub Affiliate"];
  sindex: any = 0;
  constructor(private utilSer: UtilitiesService,
    private authSer: AuthService, private toastSer: ToastService) {
    this.dateData.push(this.utilSer.getDateFromDaysBack(7));
    this.dateData.push(this.utilSer.getDateFromDaysBack(1));
    this.getStats();
  }

  ngOnInit() {
  }
  getStats() {
    const postData = this.utilSer.getBasePostData();
    postData.data["to"] = this.dateData[this.selectedIndex]["to"];
    postData.data["from"] = this.dateData[this.selectedIndex]["from"];
    this.toastSer.showOverLay("Fetching data...");
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess && apiRes.response.success) {
      this.processTableData(apiRes.response);
      this.isTableDataRendered = true;
    }
    else {
      this.isTableDataRendered = false;
      let tstmsgobj = toastmsgs.register.error;
      "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
      this.toastSer.showToaster(tstmsgobj, "error");
    }
  }
  getRecord(objkeys, record) {
    let temp = [];
    objkeys.forEach((key) => {
      if (key in record) {
        temp.push(record[key]);
      }
      else { temp.push("NA"); }
    });
    return temp;
  }
  processTableData(res) {
    let tempTableData = [];
    tempTableData.push(this.processCPAdata(res));
    tempTableData.push(this.processRevenueShareData(res));
    tempTableData.push(this.processSubAffData(res));
    this.sindex = 0;
    this.tableData = tempTableData;
  }
  processCPAdata(data) {
    const obj = { headers: [], rowData: [] };
    // rowdata is list if lists 
    const objkeys = ["name", "UNIQUE_HITS", "REFFERED_PLAYERS", "REVENUE_FROM_PLAYERS", "CHARGEBACKS", "TOTAL_REVENUE"];
    obj.headers = ["Campaign Name", "Unique Hits", "Signups", "Revenue", "Chargeback’s", "Total"];
    if ("cpaData" in data) {
      if (data["cpaData"]) {
        data["cpaData"].forEach((record) => {
          obj.rowData.push(this.getRecord(objkeys, record));
        })
      }
    }
    if ("cpaSubData" in data && data["cpaSubData"]) {
      let temp = this.getRecord(objkeys, data["cpaSubData"]);
      temp[0] = "Total";
      obj.rowData.push(temp);
    }
    return obj;
  }
  processRevenueShareData(data) {
    const obj = { headers: [], rowData: [] };
    // rowdata is list if lists 
    const objkeys = ["name", "UNIQUE_HITS", "REFFERED_PLAYERS", "CASINO_REVENUE", "CHARGEBACKS", "TOTAL_REVENUE"];
    obj.headers = ["Campaign Name", "Unique Hits", "Signups", "Revenue From Live Casino", "Chargeback’s", "Total"];
    if ("rsData" in data) {
      if (data["rsData"]) {
        data["rsData"].forEach((record) => {
          obj.rowData.push(this.getRecord(objkeys, record));
        })
      }
    }
    if ("rsSubData" in data && data["rsSubData"]) {
      let temp = this.getRecord(objkeys, data["rsSubData"]);
      temp[0] = "Total";
      obj.rowData.push(temp);
    }
    return obj;
  }
  processSubAffData(data) {
    const obj = { headers: [], rowData: [] };
    // rowdata is list if lists 
    const objkeys = ["name", "UNIQUE_HITS", "REFFERED_PLAYERS", "TOTAL_REVENUE"];
    obj.headers = ["Campaign Name", "Unique Hits", "Signups", "Revenue"];
    if ("saData" in data) {
      if (data["saData"]) {
        data["saData"].forEach((record) => {
          obj.rowData.push(this.getRecord(objkeys, record));
        })
      }
    }

    return obj;
  }


}
