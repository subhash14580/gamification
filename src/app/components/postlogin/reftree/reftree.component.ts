import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { environment } from '../../../../environments/environment';
import { appConf } from '../../../../configs/app.config';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { UtilitiesService } from '../../../../services/utilities.service';
import { dataConf } from '../../../../configs/data.config';

@Component({
  selector: 'app-reftree',
  templateUrl: './reftree.component.html',
  styleUrls: ['./reftree.component.css']
})
export class ReftreeComponent implements OnInit {
  isDataRendered: boolean = false;
  headers: any = [];
  rowData: any = [];
  noDataMsg: any = appConf.noDataForRefTree;
  isApiFailed: boolean = false;
  private api: any = environment["api_url"] + environment["get_refTree"];
  private postData: any = {
    data: {},
    headers: {}
  }
  constructor(private authSer: AuthService,
    private toastSer: ToastService,
    private utilSer: UtilitiesService) {
    this.toastSer.showOverLay("Fetching data .. ");
    this.authSer.getDataOnPostCall(this.api, this.postData, this.refTreeHandler.bind(this));

  }

  ngOnInit() {
  }
  refTreeHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        let tempHeaders = [];
        let tempRowData = [];
        const data = apiRes.response["agentObjects"];
        // process appidata 
        if (data && data.length > 0) {
          tempHeaders = this.utilSer.getHeadersFromGroupList(dataConf.refTreeColGroups);
          tempHeaders.push('Balance');
          data.forEach((record) => {
            let tempdata = this.utilSer.getSingleRowDataFromGroupList(dataConf.refTreeColGroups, record);
            let balnc = 'NA';
            if (record.walletTypeVsBalance) {
              if (Object.keys(record.walletTypeVsBalance).length > 0) {
                let key = Object.keys(record.walletTypeVsBalance)[0];
                balnc = record.walletTypeVsBalance[key]
              }
            }
            tempdata.push(balnc);
            tempRowData.push(tempdata);
          })
          // data.forEach(record => {
          //   let temp = [];
          //   for (var key in record) {
          //     if (key == "walletTypeVsBalance") {
          //       let text = "";
          //       if (Object.keys.length > 0) {
          //         for (var k in record[key])
          //           text += k + " " + record[key][k] + ","
          //       }
          //       temp.push(text.replace(/,\s*$/, ""));
          //     }
          //     else
          //       temp.push(record[key]);
          //   }
          //   tempRowData.push(temp);
          // });
        }
        this.headers = tempHeaders;
        this.rowData = tempRowData;
        this.isDataRendered = true;
      }
      else {
        this.isApiFailed = true;
      }
    }
  }
}
