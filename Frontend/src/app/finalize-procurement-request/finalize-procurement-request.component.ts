import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { FinalizeProcReqIFrameComponent } from '../HelpIFrames/FinalizeProcReqIFrame/finalize-proc-req-iframe/finalize-proc-req-iframe.component';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-finalize-procurement-request',
  templateUrl: './finalize-procurement-request.component.html',
  styleUrls: ['./finalize-procurement-request.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class FinalizeProcurementRequestComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'Status', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  ngOnInit() {
    this.GetUnfinalizedProcurementRequests();
  }

  GetUnfinalizedProcurementRequests() {
    this.dataService.GetUnfinalizedProcurements().subscribe(result => {
      let procurementList: any[] = result;
      this.ProcurementRequests = [...procurementList];
      this.SearchedPRequests = [...procurementList];
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
      this.GetUnfinalizedProcurementRequests();
    }
  }
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'awaiting payment':
        return 'orange'; // Set the color you want for 'Pending'
      case 'payed':
        return 'green'; // Set the color you want for 'Approved'
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }



  openFPRIFrameTab(): void {
    const dialogRef = this.Dialog.open(FinalizeProcReqIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
