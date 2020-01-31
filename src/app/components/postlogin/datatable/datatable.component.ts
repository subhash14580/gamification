import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {

  @Input() tdataInfo: any;
  tdata: any;
  api: any;
  rowsPerPage: any;
  numberOfPages: Number;
  tableInfoText: String;
  public headers: any = [];
  public rowData: any = [];
  postData: any = {};
  selectedPageNumber: any = 1;
  pageNumberKey: any = "";
  searchCriteriaKey: any = "";
  neglectedCols = {};
  mybutton: HTMLElement;
  constructor(private authSer: AuthService, private toastser: ToastService) { }

  ngOnInit() {
  //  this.setLocalData();
   // this.generateViewData(); // On initilization this works !!
  }


  ngOnChanges(changes: SimpleChanges) {
    this.tdataInfo = changes["tdataInfo"]["currentValue"];
    this.setLocalData();
    this.generateViewData();
    this.selectedPageNumber = 1;
    console.log(changes);
  }

  setLocalData() {
    this.tdata = this.tdataInfo["tdata"] ? this.tdataInfo["tdata"] : [];
    this.api = this.tdataInfo["api"];
    this.rowsPerPage = this.tdataInfo["rowsPerPage"];
    this.numberOfPages = Math.ceil((this.tdataInfo.total ? this.tdataInfo["total"] : 0) / this.rowsPerPage );
    this.tableInfoText = this.tdataInfo["tableInfoText"];
    this.postData = this.tdataInfo["postData"];
    this.pageNumberKey = this.tdataInfo["pageNumberKey"];
    this.searchCriteriaKey = this.tdataInfo["searchCriteriaKey"];
    this.neglectedCols = this.tdataInfo["neglectedCols"] ? this.tdataInfo["neglectedCols"] : {};


  }
  nextPage() {
    if (this.selectedPageNumber < this.numberOfPages) {
      this.getPaginationData(this.selectedPageNumber + 1);
    }
  }
  prevPage() {
    if (this.selectedPageNumber > 1) {
      this.getPaginationData(this.selectedPageNumber - 1);
    }
  }

  generateViewData() {
    let tempHeaders = [];
    let tempRowData = [];
    if (this.tdata.length > 0) {
      for (var key in this.tdata[0])
        if (!(key in this.neglectedCols))
          tempHeaders.push(key);
      tempHeaders = Object.keys(this.tdata[0]);
      this.tdata.forEach(record => {
        let temp = [];
        for (var colname in record)
          if (!(colname in this.neglectedCols))
            temp.push(record[colname]);
        tempRowData.push(temp);
      });
    }
    this.headers = tempHeaders;
    this.rowData = tempRowData;
  }
  getListOfValues(end) {
    return [...Array(end)].map((item, index) => 1 + index);
  }
  generateTdata(data) {
    this.tdataInfo.tdata = data.response[this.searchCriteriaKey];
    this.tdataInfo.total = data.response["total"];
  }
  getPaginationData(pagenumber) {
    if (pagenumber == this.selectedPageNumber)
      return;
    // change current page value in the post data (key given )
    this.toastser.showOverLay("Fetching players list");
    this.postData["data"][this.pageNumberKey] = pagenumber;
    this.authSer.getDataOnPostCall(this.api, this.postData, function (data: ApiResponseModel) {
      if (data) {
        this.toastser.hideOverLay();
        if (data.apistatus["isSuccess"]) {
          if (data.response["success"]) {
            this.generateTdata(data);
            this.setLocalData();
            this.generateViewData();
            this.selectedPageNumber = Number(pagenumber);
            // update the pagination belpow 
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
    }.bind(this))
  }
}
