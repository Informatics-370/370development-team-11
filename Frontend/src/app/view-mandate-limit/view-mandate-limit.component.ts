import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteMandateLimitComponent } from '../delete-mandate-limit/delete-mandate-limit.component';
import { DatePipe } from '@angular/common';
import { Employee } from '../Shared/Employee';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from '../Settings/restore-dialog/restore-dialog.component';
import { MandateIFrameComponent } from '../HelpIFrames/MandateIFrame/mandate-iframe/mandate-iframe.component';
import { MatPaginator } from '@angular/material/paginator';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-mandate-limit',
  templateUrl: './view-mandate-limit.component.html',
  styleUrls: ['./view-mandate-limit.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewMandateLimitComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [ 'amount', 'date', 'action', 'delete'];
  dataSource : any;

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,
    private sanitizer: DomSanitizer) { }

  deleteMandateLimit: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249'
  }
  Employees: Employee[] = [];
  Mandate_Limits: Mandate_Limit[] = [];
  RoleToUse: string = "";
  SearchedMandate_Limits: Mandate_Limit[] = [];
  searchNumber: Number = 0;
  iRole: string;
  rAdmin: string;

  OnInPutChange() {
    const Searchterm = this.searchNumber;

    if (Searchterm) {
      this.SearchedMandate_Limits = this.Mandate_Limits.filter(mandateLimit => mandateLimit.ammount == Searchterm)
    }
    else if (Searchterm == 0) {
      this.SearchedMandate_Limits = [...this.Mandate_Limits];
    }

    this.dataSource = new MatTableDataSource<Mandate_Limit>(this.SearchedMandate_Limits);
  }

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetMandateLimits();
  }

  GetMandateLimits() {
    this.dataService.GetMandateLimits().subscribe(result => {
      let employeeList: any[] = result;
      this.Mandate_Limits = [...employeeList];
      this.SearchedMandate_Limits = [...employeeList];
      this.dataSource = new MatTableDataSource(this.Mandate_Limits.filter((value, index, self) => self.map(x => x.mandate_ID).indexOf(value.mandate_ID) == index));
      this.dataSource.paginator = this.paginator
    });
  }
  DeleteMandateLimit(id: Number) {
    this.dataService.MandateDeleteUserValidation(id).subscribe(r => {
      if (r == null) {
        const confirm = this.dialog.open(DeleteMandateLimitComponent, {
          disableClose: true,
          data: { id }
        });

        this.dialog.afterAllClosed.subscribe({
          next: (response) => {
            this.ngOnInit();
          }
        })
      }
      else {
        this.dataService.GetMandateLimit(id).subscribe({
          next: (mandateReceived) => {
            this.deleteMandateLimit = mandateReceived as Mandate_Limit;
            var action = "ERROR";
            var title = "ERROR: Mandate Limit In Use";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Mandate Limit with amount R<strong>" + mandateReceived.ammount + " <strong style='color:red'>IS ASSOCIATED WITH AN EMPLOYEE!</strong><br> Please remove the mandate limit from the employee to continue with deletion.");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 4000;
            setTimeout(() => {
              dialogRef.close();
            }, duration);
          }
        })
        
      }
    })
  }


  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openRestoreDialog() {
    const dialogRef = this.dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }



  openMandateIFrameTab(): void {
    const dialogRef = this.dialog.open(MandateIFrameComponent, {
    //   width: '800px', // Set the desired width
    //  height: '600%', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
