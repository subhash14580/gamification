import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { dataConf } from '../../../../configs/data.config';
import { ToastService } from '../../../../services/toast.service';
import { toastmsgs } from '../../../../constants/toastmsgs';

@Component({
  selector: 'app-thunt',
  templateUrl: './thunt.component.html',
  styleUrls: ['./thunt.component.css']
})
export class ThuntComponent implements OnInit {
  rowData: any[];
  currentStage: any;
  userQData: any;
  qData: { question: string; options: any[]; qno: any };
  showQuestion: boolean = false;
  qans: any = "";

  constructor(private authSer: AuthService, private toastSer: ToastService) {
    this.authSer.getData("dv", this.dataHandler.bind(this));
  }

  ngOnInit(): void {
  }
  dataHandler(data) {
    this.prepareUidata(dataConf.res);
  }

  prepareUidata(data) {

    let tempRecords = [];
    let temp = [];
    for (var i = 1; i <= 3; i++) {
      if (String(i) in data["data"]["questions"])
        temp.push(data["data"]["questions"][String(i)]);
      else
        temp.push({ "NA": true });
    }
    tempRecords.push(temp);
    temp = [];
    for (var i = 4; i <= 6; i++) {
      if (String(i) in data["data"]["questions"])
        temp.push(data["data"]["questions"][String(i)]);
      else
        temp.push({ "NA": true });
    }
    tempRecords.push(temp);
    temp = [];

    for (var i = 7; i <= 9; i++) {
      if (String(i) in data["data"]["questions"])
        temp.push(data["data"]["questions"][String(i)]);
      else
        temp.push({ "NA": true });
    }
    tempRecords.push(temp);
    this.userQData = data;
    this.currentStage = data.currentStage;
    this.rowData = tempRecords;
  }

  viewMyRewards(qno) {
    this.toastSer.showModal(this.userQData["data"]["questions"][qno]["rewards"]);
  }
  viewQuestion(qno) {
    if ("openShare" in this.userQData["data"]["questions"][qno] && this.userQData["data"]["questions"][qno]["openShare"]) {
      this.toastSer.showModal("Contest is under progress");
      return;
    }

    this.showQuestion = true;
    this.qData = this.getBasicQData();
    this.qData.question = this.userQData["data"]["questions"][qno]["question"];
    this.qData.options = Object.values(this.userQData["data"]["questions"][qno]["options"]);
    this.qans = this.qData.options[0];
    this.qData.qno = qno;

  }
  getBasicQData() {
    return {
      question: "",
      options: [],
      qno: ""
    }
  }
  validateAnswer(qno, val) {
    const data = this.userQData["data"]["questions"][qno];
    if (data.options[data.answer] == val)
      return true;
    else
      this.toastSer.showToaster(toastmsgs.wronganswer.success, "error");

  }


}
