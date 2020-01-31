import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-affprgrms',
  templateUrl: './affprgrms.component.html',
  styleUrls: ['./affprgrms.component.css']
})
export class AffprgrmsComponent implements OnInit {

  constructor(private toastSer:ToastService) { 
    console.log("hi");
  }

  ngOnInit() {
  }

}
