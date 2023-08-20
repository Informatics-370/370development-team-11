import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { PlaceProcDetailIFrameComponent } from '../HelpIFrames/PlaceProcDetailIFrame/place-proc-detail-iframe/place-proc-detail-iframe.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-place-procurement-request',
  templateUrl: './place-procurement-request.component.html',
  styleUrls: ['./place-procurement-request.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class PlaceProcurementRequestComponent implements OnInit {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: any;
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanViewFlagPro = this.dataService.decodeCanViewFlagPro(sessionStorage.getItem("token"));
    this.iCanViewPenPro = this.dataService.decodeCanViewPenPro(sessionStorage.getItem("token"));

    if (this.iCanViewFlagPro == "true") {
      this.canViewFlagPro = "true";
    }

    if (this.iCanViewPenPro == "true") {
      this.canViewPenPro = "true";
    }

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
        if (e.requisition_Status_ID == 1) {
          console.log(e)
          this.dataService.GetProcurementDetailsByRequestID(e.procurement_Request_ID).subscribe(a => {
            //console.log(result)
            if (a == null) {
              this.ProcurementRequests.push(e)
              this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
              this.SearchedPRequests.paginator = this.paginator;
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

    if (this.SearchedPRequests.paginator) {
      this.SearchedPRequests.paginator.firstPage();
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



  openPPRIFrameTab(): void {
    const dialogRef = this.Dialog.open(PlaceProcDetailIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
