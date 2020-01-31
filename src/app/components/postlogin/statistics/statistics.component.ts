import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../../services/utilities.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../http/authservices/auth.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { dataConf } from '../../../../configs/data.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  dateData: any = [];
  selectedIndex: any = 0;
  isTableDataRendered: boolean = false;
  headers: any = [];
  rowData: any = [];
  tableData: any = [];
  private statsapi = environment["api_url"] + environment["statisticsSummary"];
  constructor(private utilSer: UtilitiesService,
    private authSer: AuthService, private toastSer: ToastService, private router: Router) {
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
    this.authSer.getDataOnPostCall(this.statsapi, postData, this.dataHandler.bind(this));
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
    let tempData = dataConf.statisticsDataKeys;
    tempData.forEach((obj) => {
      obj.val = "NA";
      if (obj.key in data) {
        obj.val = data[obj.key];
      }
    });
    this.tableData = tempData;
  }
  navigate(path) {
    this.router.navigate([path]);
  }
}
