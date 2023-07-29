import { Component, OnInit,ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-view-flagged-procurement-request',
  templateUrl: './view-flagged-procurement-request.component.html',
  styleUrls: ['./view-flagged-procurement-request.component.css']
})
export class ViewFlaggedProcurementRequestComponent implements OnInit{

  ProcurementRequests: Procurement_Request[] = [];
  SearchedPDetails:any;
  displayedColumns: string[] = ['name', 'employee', 'mandateTotal', 'Total', 'PaymentDue', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator:MatPaginator;
  ngOnInit() {
    this.GetProcurementDetails();
    console.log(this.ProcurementDetails)
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  ProcurementDetails:Procurement_Details[] = [];
  GetProcurementDetails() {
    this.dataService.GetProcurementRequestDetails().subscribe(result => {
      result.forEach(e => {
        if(e.procurement_Status_ID == 3)
        this.ProcurementDetails.push(e);
      })

      this.SearchedPDetails = new MatTableDataSource(this.ProcurementDetails);
      this.SearchedPDetails.paginator = this.paginator;
      if (result) {
        hideloader();
      }
    })

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedPDetails = this.ProcurementDetails.filter(PR => PR.procurement_Request.vendor.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.SearchedPDetails = [...this.ProcurementDetails];
    }

    if (this.SearchedPDetails.paginator) {
      this.SearchedPDetails.paginator.firstPage();
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange'; // Set the color you want for 'Pending'
      case 'accepted':
        return 'green'; // Set the color you want for 'Approved'
      case 'rejected':
        return 'red'; // Set the color you want for 'Rejected'
      // Add more cases for other status values if needed
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }
}
