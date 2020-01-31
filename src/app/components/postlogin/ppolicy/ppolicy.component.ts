import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-ppolicy',
  templateUrl: './ppolicy.component.html',
  styleUrls: ['./ppolicy.component.css']
})
export class PpolicyComponent implements OnInit {

  constructor(private toastSer: ToastService) {
    this.toastSer.hideOverLay();
  }

  ngOnInit() {
  }

}
