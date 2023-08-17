import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditLog } from '../Shared/AuditLog';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { BackupComponent } from '../Settings/backup/backup.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RestoreDialogComponent } from '../Settings/restore-dialog/restore-dialog.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { AuditLogIFrameComponent } from '../HelpIFrames/AuditLogIFrame/audit-log-iframe/audit-log-iframe.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-audit-log',
  templateUrl: './view-audit-log.component.html',
  styleUrls: ['./view-audit-log.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewAuditLogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;
  dataSource: any;
  filters: any[] = ["None", "User", "Action"]

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  ngOnInit(): void {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetLogs()
  }

  Logs: AuditLog[] = [];
  displayedColumns: string[] = ['Time', 'User', 'Action'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = "None";

  GetLogs() {
    this.dataService.GetLogs().subscribe(result => {
      let LogList: any[] = result;
      this.Logs = [...LogList];
      this.dataSource = new MatTableDataSource(this.Logs.filter((value, index, self) => self.map(x => x.log_ID).indexOf(value.log_ID) == index));
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

  RefreshLogs() {
    this.dataService.GetLogs().subscribe(result => {
      let LogList: any[] = result;
      this.Logs = [...LogList];

    });
  }
  OnInPutChange() {
    const Searchterm = this.searchWord; // Use this.selectedFilter instead of this.searchWord
    console.log(Searchterm);

    if (Searchterm === "User") {
      this.RefreshLogs()
      this.dataSource = this.Logs.sort((a, b) => {
        if (a.user < b.user) {
          return -1;
        } else if (a.user > b.user) {
          return 1;
        }
        return 0;
      });

      this.dataSource = new MatTableDataSource(this.Logs.filter((value, index, self) => self.map(x => x.log_ID).indexOf(value.log_ID) == index));
      this.dataSource.paginator = this.paginator
    }
    else if (Searchterm === "Action") {
      this.RefreshLogs()
      this.dataSource = this.Logs.sort((a, b) => {
        if (a.action < b.action) {
          return -1;
        } else if (a.action > b.action) {
          return 1;
        }
        return 0;
      });

      this.dataSource = new MatTableDataSource(this.Logs.filter((value, index, self) => self.map(x => x.log_ID).indexOf(value.log_ID) == index));
      this.dataSource.paginator = this.paginator
    }
    else if (Searchterm === "None") {
      this.GetLogs()
    }
  }


  openDialog() {
    const dialogRef = this.Dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRestoreDialog() {
    const dialogRef = this.Dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openViewAuditLogIFrameTab(): void {
    const dialogRef = this.Dialog.open(AuditLogIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
