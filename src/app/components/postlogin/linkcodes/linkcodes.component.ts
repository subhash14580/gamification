import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../http/authservices/auth.service';
import { environment } from '../../../../environments/environment';
import { ApiResponseModel } from '../../../../models/ApiResponse.model';
import { toastmsgs } from '../../../../constants/toastmsgs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-linkcodes',
  templateUrl: './linkcodes.component.html',
  styleUrls: ['./linkcodes.component.css']
})
export class LinkcodesComponent implements OnInit {

  affCode: any = "";
  public sidebarMinimized = false;
  public isUserLoggedIn: Boolean = false;
  secondMainTypeIndex: number;
  mainItems: string[];
  campaignsList: any = [];
  firstMainType: string;
  data: any;
  imgObj: any = { src: "", height: 0, width: 0 };
  isCallComplete: boolean = false;
  isApiFailed: boolean = false;
  prependImgURL = environment.baseUrl;
  linkCodeHtmlText: any = "";
  textLink: any = "";
  private api: any = environment.api_url + environment["get_link_codes"];
  constructor(private authSer: AuthService, private toastSer: ToastService) {
    const postData = {
      data: {},
      headers: {}
    }
    this.toastSer.showOverLay("Getting promos ");
    this.authSer.getDataOnPostCall(this.api, postData, this.dataHandler.bind(this));

  }
  ngOnInit() {

  }
  processBannersData(apiRes: ApiResponseModel) {
    this.campaignsList = apiRes.response["campaignObjectList"] ? apiRes.response["campaignObjectList"] : [];
    this.affCode = this.campaignsList.length > 0 ? this.campaignsList[0]["code"] : "";
    this.data = apiRes.response;
    this.mainItems = Object.keys(this.data.bannersMap);
    if (this.mainItems.length > 0) {
      this.firstMainType = this.mainItems[0];
      this.secondMainTypeIndex = 0;
      this.prepareImgObj();
      this.prepareLinkCodeText();
    }

  }
  prepareLinkCodeText() {
    let tempStr = "<a target='_blank' href=" + this.prependImgURL + "/affiliate?ID=" + this.affCode + ">";
    tempStr += "<img src='" + this.imgObj.src + "' width='" + this.imgObj.width + "' height='" + this.imgObj.height + "' border=0>";
    tempStr += "</a>";
    this.linkCodeHtmlText = tempStr;
    this.textLink = this.prependImgURL + "/affiliate?ID=" + this.affCode;

  }
  prepareImgObj() {
    const imgInfo = this.data.bannersMap[this.firstMainType][Number(this.secondMainTypeIndex)];
    this.imgObj.src = (this.prependImgURL + imgInfo["bannerObjects"][0]["text"]);
    this.imgObj.width = imgInfo.width;
    this.imgObj.height = imgInfo.height;

  }
  affCodeChange(val) {
    this.affCode = val;
    this.prepareLinkCodeText();
  }
  dataHandler(apiRes: ApiResponseModel) {
    this.toastSer.hideOverLay();
    if (apiRes.apistatus.isSuccess) {
      if (apiRes.response.success) {
        this.processBannersData(apiRes);
        this.isCallComplete = true;
      }
      else {
        this.isApiFailed = true;
        const tstmsg = toastmsgs.simpleAPiErrormsg.success;
        tstmsg.title = apiRes.response["code"];
        this.toastSer.showToaster(tstmsg, "error");
      }
    }


  }
  changeSub($event) {
    this.secondMainTypeIndex = $event.target.value;
    this.prepareImgObj();
    this.prepareLinkCodeText();
  }
  changeMain($event) {
    this.firstMainType = $event.target.value;
    this.secondMainTypeIndex = 0;
    this.prepareImgObj();
    this.prepareLinkCodeText();
  }

}
