import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../Shared/AuditLog';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { BackupComponent } from '../Settings/backup/backup.component';

@Component({
  selector: 'app-view-audit-log',
  templateUrl: './view-audit-log.component.html',
  styleUrls: ['./view-audit-log.component.css']
})
export class ViewAuditLogComponent implements OnInit {

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;

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

  GetLogs() {
    this.dataService.GetLogs().subscribe(result => {
      let LogList: any[] = result;
      this.Logs = [...LogList];
      if (result) {
        hideloader();
      }

    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }


  }

  openDialog() {
    const dialogRef = this.Dialog.open(BackupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRestoreDialog() {
    const dialogRef = this.Dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
