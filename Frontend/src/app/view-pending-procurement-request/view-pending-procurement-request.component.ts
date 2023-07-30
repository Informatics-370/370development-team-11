import { Component, OnInit,ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-view-pending-procurement-request',
  templateUrl: './view-pending-procurement-request.component.html',
  styleUrls: ['./view-pending-procurement-request.component.css']
})
export class ViewPendingProcurementRequestComponent implements OnInit {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests:any;
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.GetProcurementRequests();
    console.log(this.ProcurementRequests)
    console.log(this.SearchedPRequests)
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  GetProcurementRequests() {
    this.dataService.GetProcurementRequests().subscribe(result => {
      let procurementRequestList: any[] = result;
      procurementRequestList.forEach(e => {
        //console.log(e)
        if (e.requisition_Status_ID == 3) {
          this.ProcurementRequests.push(e)
          //this.SearchedPRequests.push(e)
        }
      })

      //this.ProcurementRequests = [...procurementRequestList];
      this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
      this.SearchedPRequests.paginator = this.paginator;
      //console.log(this.SearchedPRequests[0].requisition_Status_ID)
      if (result) {
        hideloader();
      }

    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedPRequests = this.ProcurementRequests.filter(PR => PR.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.SearchedPRequests = [...this.ProcurementRequests];
    }

    if (this.SearchedPRequests.paginator) {
      this.SearchedPRequests.paginator.firstPage();
    }
  }



  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange'; // Set the color you want for 'approval required'
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
