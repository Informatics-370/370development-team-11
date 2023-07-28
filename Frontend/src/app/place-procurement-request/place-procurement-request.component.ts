import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';

@Component({
  selector: 'app-place-procurement-request',
  templateUrl: './place-procurement-request.component.html',
  styleUrls: ['./place-procurement-request.component.css']
})
export class PlaceProcurementRequestComponent implements OnInit{
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

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
        if(e.requisition_Status_ID == 1) {
          console.log(e)
          this.dataService.GetProcurementDetailsByRequestID(e.procurement_Request_ID).subscribe(a => {
            //console.log(result)
            if(a == null) {
              this.ProcurementRequests.push(e)
              this.SearchedPRequests = [...this.ProcurementRequests];
            }
           
          })
          
          //this.SearchedPRequests.push(e)
        }
      })
      //this.ProcurementRequests = [...procurementRequestList];
      //this.SearchedPRequests = [...this.ProcurementRequests];
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
