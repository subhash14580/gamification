import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ToastService } from '../../../../services/toast.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chargebacks',
  templateUrl: './chargebacks.component.html',
  styleUrls: ['./chargebacks.component.css']
})
export class ChargebacksComponent implements OnInit {
  dateData: any = [];
  selectedIndex: any = 0;
  isTableDataRendered: boolean = false;
  headers: any = ["Date", "TotalAmount"];
  private api = environment["api_url"] + environment["chargebacks"];
  rowData: any = [];
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
      this.isTableDataRendered = false;
      let tstmsgobj = toastmsgs.register.error;
      "code" in apiRes.response && (tstmsgobj.title = apiRes.response["code"]);
      this.toastSer.showToaster(tstmsgobj, "error");
    }
  }
  processTableData(data) {
    let tempRowData = [];
    if (data["chargeBackObjects"]) {
      tempRowData = data["chargeBackObjects"];
    }
    this.rowData = tempRowData;
  }

}
