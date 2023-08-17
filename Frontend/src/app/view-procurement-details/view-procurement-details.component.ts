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
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-view-procurement-details',
  templateUrl: './view-procurement-details.component.html',
  styleUrls: ['./view-procurement-details.component.css']
})
export class ViewProcurementDetailsComponent {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'Vendor', 'Status', 'POP', 'Inv', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  // fileToUpload: File | null = null;
  // files: any[] = [''];
  // sPath = "";

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

  openDialog(name: string, ID: Number) {
    console.log(name)
    this.Dialog.open(UploadPayementFileComponent, {
      data: { name, ID },
      disableClose: true
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
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
        console.log(response)
      }
    })
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

  // onFileUpload(event: any) {
  //   this.fileToUpload = event.target.files[0];
  //   if (this.fileToUpload != null) {
  //     this.files[0] = this.fileToUpload;
  //   }
  // }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'done':
        return 'green'; // Set the color you want for 'Pending'
      case 'awaiting delivery':
        return 'orange';
      case 'Item Received and checked':
        return 'blue'; // Set the color you want for 'Approved'
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

}
