import { Component, OnInit } from '@angular/core';
import { dataConf } from '../../../../configs/data.config';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  supportmail = dataConf.supportmail;
  constructor(private toastSer: ToastService) {
    this.toastSer.hideOverLay();
  }

  ngOnInit() {
  }

}
