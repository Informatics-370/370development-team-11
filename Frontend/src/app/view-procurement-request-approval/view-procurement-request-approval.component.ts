import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';

@Component({
  selector: 'app-view-procurement-request-approval',
  templateUrl: './view-procurement-request-approval.component.html',
  styleUrls: ['./view-procurement-request-approval.component.css']
})
export class ViewProcurementRequestApprovalComponent implements OnInit{
  
  
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    //this.GetProcurementRequests();
   // console.log(this.ProcurementRequests)

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

}
