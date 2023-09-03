import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { DeleteProcurementRequestComponent } from '../delete-procurement-request/delete-procurement-request.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { ProcReqIFrameComponent } from '../HelpIFrames/ProcReqIFrame/proc-req-iframe/proc-req-iframe.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-view-procurement-request',
  templateUrl: './view-procurement-request.component.html',
  styleUrls: ['./view-procurement-request.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewProcurementRequestComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'Status', 'action', 'delete'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private http: HttpClient, private sanitizer: DomSanitizer) { }
  searchWord: string = '';
  ProcurementQuotes: Procurement_Request_Quote[] = [];
  expandedElement: Procurement_Request_Quote | undefined;
  dataSource: any;


  FileDetails: any[] = [];

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  getFileDetailsForRequest(procurement_Request_ID: Number) {
    return this.FileDetails.filter(detail => detail.procurement_Request_ID === procurement_Request_ID);
  }


  ngOnInit() {
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


    this.GetProcurementRequests();
    this.GetPRQuotes()

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
  }

  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
      URL.revokeObjectURL(fileURL);
    });
    // window.open(url, '_blank');
  }
  User: String = this.dataService.decodeUser(sessionStorage.getItem("token"));

  GetProcurementRequests() {
    this.dataService.GetProcurementRequestsForUser(this.User).subscribe(result => {
      let procurementRequestList: any[] = result;
      this.ProcurementRequests = [...procurementRequestList];
      this.SearchedPRequests = [...procurementRequestList];
      this.dataSource = new MatTableDataSource(this.ProcurementRequests.filter((value, index, self) => self.map(x => x.procurement_Request_ID).indexOf(value.procurement_Request_ID) == index));
      this.dataSource.paginator = this.paginator
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
      this.dataSource = this.ProcurementRequests.filter(PR => PR.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.GetProcurementRequests()
    }
  }

  GetPRQuotes() {
    this.dataService.GetProcurementQuotes().subscribe({
      next: (response) => {
        this.ProcurementQuotes = response;

        for (let i = 0; i < this.ProcurementQuotes.length; i++) {
          this.FileDetails.push({ FileURL: "", FileName: "" })
          let sFile = this.ProcurementQuotes[i].path;

          if (sFile != "None") {
            let VendorName = sFile.substring(0, sFile.indexOf("\\"))
            let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
            let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${RequestID}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
        }

      }
    })
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange';
      case 'accepted (ready to order)':
        return 'green';
      case 'done':
        return 'green';
      case 'rejected':
        return 'red';

      default:
        return 'black';
    }
  }

  DeleteRequest(ID: Number) {
    this.dataService.ValidatePRRequestDelete(ID).subscribe({
      next: (IsExist) => {
        if (IsExist == null) {
          const confirm = this.Dialog.open(DeleteProcurementRequestComponent, {
            disableClose: true,
            data: { ID }
          });

          this.Dialog.afterAllClosed.subscribe({
            next: (response) => {
              this.ngOnInit();
            }
          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Request In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Procurement Request <strong style='color:red'>IS ASSOCIATED WITH A PROCUREMENT!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.Dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 4000;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })
  }





  openPRIFrameTab(): void {
    const dialogRef = this.Dialog.open(ProcReqIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
