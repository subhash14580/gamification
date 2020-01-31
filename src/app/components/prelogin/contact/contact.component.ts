import { Component, OnInit } from '@angular/core';
import { dataConf } from '../../../../configs/data.config';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  supportmail = dataConf.supportmail;
  constructor(private toastSer: ToastService) {
    this.toastSer.hideOverLay();
  }

  ngOnInit() {
  }

}
