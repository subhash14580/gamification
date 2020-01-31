import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { appConf } from '../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public overLayHandler: Subject<any> = new Subject<any>();
  private isOverLayShowing: boolean = false;
  private isModalShowing: boolean = false;
  constructor(private toastr: ToastrService) { }
  showToaster(obj, type, options?) {
    const title = "title" in obj ? obj["title"] : "";
    const msg = "msg" in obj ? obj["msg"] : "";
    let opns = {};
    if (options) {
      opns = options;
    };
    switch (type) {
      case "success": this.toastr.success(title, msg, opns);
        break;
      case "error": this.toastr.error(title, msg, opns);
        break;
      case "info": this.toastr.info(title, msg, opns);
        break;
      case "warning": this.toastr.warning(title, msg, opns);
        break;
    }
  }
  showOverLay(displayMsg = "") {
    if (!this.isOverLayShowing) {
      this.overLayHandler.next({ status: true, displayMsg: displayMsg, type: 'overlay' });
      this.isOverLayShowing = true;
    }
  }
  hideOverLay() {
    this.overLayHandler.next({ status: false, displayMsg: '', type: 'overlay' });
    this.isOverLayShowing = false;
  }
  showModal(text?) {
    
      if (!text)
        text = appConf.nothingToDisplayMsg;
      this.overLayHandler.next({ status: true, displayMsg: text, type: 'modal' });
      this.isModalShowing = true;
    
  }
  hideModal() {
      this.overLayHandler.next({ status: false, displayMsg: '', type: 'modal' });
      this.isModalShowing = false;
    
  }
}
