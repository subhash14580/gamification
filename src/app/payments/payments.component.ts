import { Component, OnInit } from '@angular/core';
import { AuthService } from '../http/authservices/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { ToastService } from '../../services/toast.service';
import { ApiResponseModel } from '../../models/ApiResponse.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  paymentHistoryObjectsKeys = ["date", "hits", "referredPlayers", "referredWMs", "total", "paidAmount", "reversedAmount", "state"]
  dateData: any = [];
  selectedIndex: any = 0;
  isTableDataRendered: boolean = false;
  rowData: any = [];
  private api = environment["api_url"] + environment["payments"];
  constructor(private utilSer: UtilitiesService,
    private authSer: AuthService, private toastSer: ToastService) {
    this.dateData.push(this.utilSer.getDateFromDaysBack(7));
    this.dateData.push(this.utilSer.getDateFromDaysBack(1));
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
      //  this.isTableDataRendered = false;
      //  let tstmsgobj = toastmsgs.register.error;
      // "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
      // this.toastSer.showToaster(tstmsgobj, "error");
    }
  }
  processTableData(res) {
    let tempRowData = [];
    // first push paymentHistoryObjects 
    if ("paymentHistoryObjects" in res && res["paymentHistoryObjects"]) {
      res["paymentHistoryObjects"].forEach(record => {

        tempRowData.push(this.getRecord(record));
      });
    }
    // now get from summary datra summary = {a:1,b:1}
    if ("summary" in res && res["summary"]) {
      let temp = this.getRecord(res["summary"]);
      temp[0] = "Total";
      tempRowData.push(temp);
    }
    this.rowData = tempRowData;

  }
  getRecord(record) {
    let temp = [];
    this.paymentHistoryObjectsKeys.forEach((key) => {
      if (key in record) {
        temp.push(record[key]);
      }
      else { temp.push("NA"); }
    });
    return temp;
  }

}
