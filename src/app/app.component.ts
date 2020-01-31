import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../services/toast.service';
import { appConf } from '../configs/app.config';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private showSpinner: boolean = false;
  showModal: boolean = false;
  public displayMsg: string = "";
  modalText: any = appConf.nothingToDisplayMsg;
  constructor(private router: Router, private spinner: NgxSpinnerService, private toastSer: ToastService) {
    this.toastSer.overLayHandler.subscribe((overLayNotif) => {
      if (overLayNotif != null && overLayNotif != undefined) {
        switch (overLayNotif.type) {
          case "overlay": this.setOverLayStatus(overLayNotif.status, overLayNotif.displayMsg);
            break;
          case "modal": this.setModalOverLayStatus(overLayNotif.status, overLayNotif.displayMsg);
            break;
        }


      }
    })
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  setOverLayStatus(status, msg) {
    if (status) {
      this.displayMsg = msg;
      this.spinner.show();
    }
    else {
      this.displayMsg = "";
      this.spinner.hide();
    }
  }
  setModalOverLayStatus(status, msg) {
    if (status) {
      this.showModal = false;
      this.modalText = msg;
      this.showModal = true;
    }
    else {
      this.hideModalOverlay();
    }
  }
  hideModalOverlay() {
    this.showModal = false;
    this.modalText = appConf.nothingToDisplayMsg;
  }

}
