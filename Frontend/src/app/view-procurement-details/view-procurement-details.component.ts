import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';

@Component({
  selector: 'app-view-procurement-details',
  templateUrl: './view-procurement-details.component.html',
  styleUrls: ['./view-procurement-details.component.css']
})
export class ViewProcurementDetailsComponent {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'Status', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  ngOnInit() {
    this.GetProcurementDetails();
  }

  GetProcurementDetails() {
    this.dataService.GetProcurementRequestDetails().subscribe(result => {
      this.ProcurementRequests = result;
      console.log(result)
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
      case 'finished':
        return 'blue'; // Set the color you want for 'Pending'
      case 'placed':
        return 'green'; // Set the color you want for 'Approved'
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }
}
