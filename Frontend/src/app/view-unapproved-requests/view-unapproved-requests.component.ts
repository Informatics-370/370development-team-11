import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
@Component({
  selector: 'app-view-unapproved-requests',
  templateUrl: './view-unapproved-requests.component.html',
  styleUrls: ['./view-unapproved-requests.component.css']
})
export class ViewUnapprovedRequestsComponent {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'Vendor', 'Status', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanViewFlagPro = this.dataService.decodeCanViewFlagPro(sessionStorage.getItem("token"));
    this.iCanViewPenPro = this.dataService.decodeCanViewPenPro(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.canViewFlagPro = "true";
      this.canViewPenPro = "true";
    }

    if (this.iCanViewFlagPro == "true") {
      this.canViewFlagPro = "true";
    }

    if (this.iCanViewPenPro == "true") {
      this.canViewPenPro = "true";
    }

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

  getStatus(status: number): string {
    switch (status) {
      case 3:
        return 'sign off required'; // Set the color you want for 'Pending'
      case 1:
        return 'has not been signed off'; // Set the color you want for 'Approved'
      case 2:
        return 'signed off'; // Set the color you want for 'Rejected'
      default:
        return 'sign off required'; // Default color if the status doesn't match any case
    }
  }

  getStatusColor(status: number) {
    switch (status) {
      case 3:
        return 'orange'; // Set the color you want for 'Pending'
      case 2:
        return 'green'; // Set the color you want for 'Approved'
      case 1:
        return 'red'; // Set the color you want for 'Rejected'
      default:
        return 'orange'; // Default color if the status doesn't match any case
    }
  }
}
