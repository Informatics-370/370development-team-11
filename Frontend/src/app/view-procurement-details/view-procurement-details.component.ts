import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notification } from '../Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { UploadPayementFileComponent } from '../upload-payement-file/upload-payement-file.component';
import { UploadInvoiceComponent } from '../upload-invoice/upload-invoice.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Procurement_Details } from '../Shared/ProcurementDetails';
pdfMake.vfs = pdfFonts.pdfMake.vfs;





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { ProcDetailIFrameComponent } from '../HelpIFrames/ProcDetailIFrame/proc-detail-iframe/proc-detail-iframe.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-view-procurement-details',
  templateUrl: './view-procurement-details.component.html',
  styleUrls: ['./view-procurement-details.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewProcurementDetailsComponent implements OnInit {
  ProcurementRequests: Procurement_Details[] = [];
  SearchedPRequests: Procurement_Details[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'Vendor', 'Status', 'POP', 'Inv', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;


  ngOnInit() {
    this.GetProcurementDetails();
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
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
  }

  GetProcurementDetails() {
    this.dataService.GetProcurementRequestDetails().subscribe(result => {
      this.ProcurementRequests = result;
      if (result) {
        hideloader();
      }
    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  openDialog(name: string, ID: Number) {
    console.log(name)
    this.Dialog.open(UploadPayementFileComponent, {
      data: { name, ID },
      disableClose: true
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit()
        console.log(response)
      }
    })
  }

  openInvDialog(name: string, ID: Number) {
    console.log(name)
    this.Dialog.open(UploadInvoiceComponent, {
      data: { name, ID },
      disableClose: true
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit()
        console.log(response)
      }
    })
  }
  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedPRequests = this.ProcurementRequests.filter(PR => PR.procurement_Request.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.SearchedPRequests = [...this.ProcurementRequests];
    }
  }


  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'done':
        return 'green'; // Set the color you want for 'Pending'
      case 'awaiting delivery':
        return 'orange';
      case 'item received and checked':
        return 'blue';
      case 'item received and checked':
        return 'blue';
      case 'asset registered':
        return 'blue';// Set the color you want for 'Approved'
      case 'asset to be registered':
        return 'blue';
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }

  getInvoice(requisition_Status: String): boolean {
    switch (requisition_Status) {
      case '2':
        return true;
      default:
        return false;
    }
  }

  getFlagged(status: string): boolean {
    switch (status.toLowerCase()) {
      case 'flagged':
        return true; // Set the color you want for 'Pending'
      default:
        return false; // Default color if the status doesn't match any case
    }
  }




  openPRDIFrameTab(): void {
    const dialogRef = this.Dialog.open(ProcDetailIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }

  Receive(Procurement: string, ID: Number) {
    console.log(Procurement)
    console.log(ID)
    if (Procurement == "Consumable") {
      this.router.navigate(["/ReceiveProcurementItem/" + ID])
    }

    else if (Procurement == "Assets") {
      this.router.navigate(["/ReceiveAsset/" + ID])
    }
  }
}
