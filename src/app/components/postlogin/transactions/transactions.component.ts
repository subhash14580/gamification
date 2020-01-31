import { Component, OnInit } from '@angular/core';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../http/authservices/auth.service';
import { FormBuilder } from '@angular/forms';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { environment } from '../../../../environments/environment';
import { appConf } from '../../../../configs/app.config';
import { UtilitiesService } from '../../../../services/utilities.service';
import { dataConf } from '../../../../configs/data.config';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  public isTableDataRendered: boolean = false;
  public tdataInfo: any = {};
  headers: any = [];
  rowData: any = [];
  headerspart = dataConf.transactheaders
  private api = environment["api_url"] + environment["get_playerslist_api"];
  private tablePostData: any = "";
  selectedPageNumber: any;
  selectedPageNumberBeforeRequest: any;
  modifiedBckpInput: {};
  numberOfPages: number;
  tableInfoText: any = appConf.transactionResultsInfoTextKey;

  constructor(private authSer: AuthService, private formBuilder: FormBuilder,
    private toastser: ToastService, private utilSer: UtilitiesService) { }

  public inputs: any = {
    startDate: "",
    endDate: "",
    currency: appConf.preferredCurrency,
    // agenttype: "myself",
    limit: 10,
    index: 1,
    typedata: {
      Deposit: { status: false, val: "Deposit" },
      Chargeback: { status: false, val: "Chargeback" },
      Cashout: { status: false, val: "Cashout" },
      BonusAdjustment: { status: false, val: "Bonus Adjustment" },
      TransferCancellation: { status: false, val: "Transfer Cancellation" },
      TransferfromPlayer: { status: false, val: "Transfer from Player" },
      ReferringRevenue: { status: false, val: "Referring Revenue" },
      TransfertoPlayer: { status: false, val: "Transfer to Player" },
      CashoutReverse: { status: false, val: "Cashout Reverse" },
      TransfertoAgent: { status: false, val: "Transfer to Agent" },
      TransferfromAgent: { status: false, val: "Transfer from Agent" }

    }
  }








  ngOnInit() {

  }
  changeCurrency(data) {
    this.inputs.currency = data;
  }
  changeAgentType(data) {
    this.inputs.agenttype = data;
  }
  getTransactionHistory(pageNumber, fromSearch?) {
    let ops = "";
    let modifiedInput = {};
    if (fromSearch) {
      if (this.inputs.startDate.trim().length > 0 && this.inputs.startDate.split("-").length == 3) {
        // modify date 
        this.inputs.startDate = this.inputs.startDate.split("-").reverse().join("-");
      }
      if (this.inputs.endDate.trim().length > 0 && this.inputs.endDate.split("-").length == 3) {
        // modify date 
        this.inputs.endDate = this.inputs.endDate.split("-").reverse().join("-");
      }
      const typeData = this.inputs["typedata"];
      for (var chkbox in typeData) {
        if (typeData[chkbox]["status"])
          ops += typeData[chkbox]["val"] + ",";
      }
      ops = this.utilSer.trimLastCharFromString(ops, ",");
      modifiedInput = this.utilSer.filterDataObj(this.inputs);
      delete modifiedInput["typedata"];
      ops = this.utilSer.trimLastCharFromString(ops, ",");
      if (ops != "")
        modifiedInput["type"] = ops;
      this.modifiedBckpInput = modifiedInput;
    }
    else
      modifiedInput = this.modifiedBckpInput;
    modifiedInput["index"] = pageNumber;
    const postData = {
      data: modifiedInput,
      headers: {}
    };
    this.selectedPageNumberBeforeRequest = pageNumber;
    console.log(postData);
    this.toastser.showOverLay("Fetching transactions");
    this.authSer.getDataOnPostCall(environment["api_url"] + environment["transaction_api"], postData, this.transactionHistoryHandler.bind(this));

  }
  generateTdata(data) {
    this.tdataInfo.tdata = data.response["referredAgentsInfo"];
    if (!this.tdataInfo.tdata)
      this.tdataInfo.tdata = [];
    this.numberOfPages = Math.ceil((data.response["total"] ? data.response.total : 0) / this.inputs.limit);

  }
  processData(data: ApiResponseModel) {
    let tempHeaders = [];
    let tempRowData;
    tempRowData = this.constructTable(this.headerspart[0], this.headerspart[1], data.response);
    if (!tempRowData)
      tempRowData["data"] = [];
    this.headers = this.headerspart[0].concat(this.headerspart[1]);
    this.rowData = tempRowData["data"];


  }
  transactionHistoryHandler(data: ApiResponseModel) {
    this.toastser.hideOverLay();

    if (data) {
      if (data.apistatus["isSuccess"]) {
        if (data.response["success"]) {
          this.toastser.showToaster(toastmsgs.successmsg.success, "success");
          // this.resetFormData();
          this.generateTdata(data);
          this.processData(data);
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
        this.toastser.showToaster(toastmsgs.simpleAPiErrormsg, "error");
      }
    }
  }
  resetFormData() {
    for (var key in this.inputs) {
      if (typeof (key) == "string") {
        if (key == "rowsperpage")
          this.inputs.key = 10;
        else
          this.inputs.key = "";
      }
      else {
        for (var chkbx in this.inputs[key])
          this.inputs[key][chkbx]["status"] = false;
      }
    }
  }
  nextPage() {
    if (this.selectedPageNumber < this.tdataInfo.numberOfPages) {
      this.getTransactionHistory(this.selectedPageNumber + 1);
    }
  }
  prevPage() {
    if (this.selectedPageNumber > 1) {
      this.getTransactionHistory(this.selectedPageNumber - 1);
    }
  }
  getListOfValues(noofPages) {
    return this.utilSer.getListOfValues(noofPages);
  }

  constructTable(headers, iBHeaders, data) {
    var result = { data: [] };
    data.values.forEach(function (record) {
      var row = [];
      headers.forEach(function (header) {
        var value;
        // console.log("header", record[header], header);
        if (record[header]) {
          if (typeof record[header] === "object") {
            value = record[header].value;
            if (value != 0 && !value && record[header].name)
              value = record[header].name;
            if (value != 0 && !value || (typeof value === "string" && value.length === 0))
              value = "NA"
          }
          else if (typeof record[header] === "number") {
            value = record[header];
          }
          else if (typeof record[header] === "string") {
            value = record[header];
            if (value.length === 0)
              value = "NA"
          }
          else {
            value = "NA"
          }

        }
        else {
          value = "NA"
        }
        row.push(value);
      })

      iBHeaders.forEach(function (header) {
        var value;

        if (record.initialBalance && record.initialBalance[header]) {
          if (typeof record.initialBalance[header] === "object") {
            value = record.initialBalance[header].value;
            if (value != 0 && !value && record.initialBalance[header].name)
              value = record.initialBalance[header].name;
            if (value != 0 && !value || (typeof value === "string" && value.length === 0))
              value = "NA"
          }
          else if (typeof record.initialBalance[header] === "number") {
            value = record.initialBalance[header];
          }
          else if (typeof record.initialBalance[header] === "string") {
            value = record.initialBalance[header];
            if (value.length === 0)
              value = "NA"
          }
          else {
            value = "NA"
          }
        }
        else
          value = "NA"
        row.push(value);
      })
      result.data.push(row);
    })
    return result;
  }


}
