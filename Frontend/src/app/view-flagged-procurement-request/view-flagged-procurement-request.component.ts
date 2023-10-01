import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { FlaggerProcDetailIFrameComponent } from '../HelpIFrames/FlaggedProcDetailIFrame/flagger-proc-detail-iframe/flagger-proc-detail-iframe.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-view-flagged-procurement-request',
  templateUrl: './view-flagged-procurement-request.component.html',
  styleUrls: ['./view-flagged-procurement-request.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewFlaggedProcurementRequestComponent implements OnInit {

  ProcurementRequests: Procurement_Request[] = [];
  SearchedPDetails: any;
  displayedColumns: string[] = ['name', 'employee', 'mandateTotal', 'Total', 'PaymentDue', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  iRole: string;
  iTempRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iTempRole = this.dataService.decodeTempAcc(sessionStorage.getItem("token"));
    this.iCanViewFlagPro = this.dataService.decodeCanViewFlagPro(sessionStorage.getItem("token"));
    this.iCanViewPenPro = this.dataService.decodeCanViewPenPro(sessionStorage.getItem("token"));

    // if (this.iRole == "Admin" || this.iRole == "MD") {
    //   this.canViewFlagPro = "true";
    //   this.canViewPenPro = "true";
    // }

    if (this.iCanViewFlagPro == "true") {
      this.canViewFlagPro = "true";
    }

    if (this.iCanViewPenPro == "true") {
      this.canViewPenPro = "true";
    }

    

    this.GetProcurementDetails();
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
  }

  ProcurementDetails: Procurement_Details[] = [];
  GetProcurementDetails() {
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))

    if (this.iRole == "FD" || this.iTempRole == "FD") {
      this.dataService.GetProcurementRequestDetailsFD().subscribe(result => {
        result.forEach(e => {
          if (e.procurement_Status_ID == 3)
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

    if (this.iRole == "MD" || this.iTempRole == "MD") {
      this.dataService.GetProcurementRequestDetailsMD().subscribe(result => {
        result.forEach(e => {
          if (e.procurement_Status_ID == 3)
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



  openFPRIFrameTab(): void {
    const dialogRef = this.Dialog.open(FlaggerProcDetailIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
