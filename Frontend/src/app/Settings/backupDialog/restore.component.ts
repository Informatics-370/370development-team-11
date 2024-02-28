import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackdropOptions } from 'chart.js';
import { BackupComponent } from '../backup/backup.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { AuditLog } from 'src/app/Shared/AuditLog';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]

})
export class RestoreComponent {
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;
  backupStatus: string;
  isLoading: boolean;


  constructor(public dialogRef: MatDialogRef<BackupComponent>, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  downloadUrl: string;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  onConfirm(): void {
    this.isLoading = true;

    this.dataService.createBackup().subscribe({
      next: (response) => {
        if (response) {
          console.log(response)
          this.downloadUrl = response.url
          this.downloadBackup()

          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          this.isLoading = false;

          var action = 'RESTORE SUCCESSFUL';
          var title = 'Backup Successful';
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
            'The <strong>Backup</strong> has been <strong style="color:green">CREATED</strong> successfully!'
          );
          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            data: { action, title, message }
          });
          setTimeout(() => {
            this.showSuccessDialog = false;
            this.dialogRef.close();
            this.Logout();
          }, 1750);
        } else {
          this.isLoading = false;

          var action = "ERROR";
          var title = "ERROR: Backup Unsuccessful";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The <strong>Backup</strong> was <strong style='color:red'>UNSUCCESSFUL!</strong>");

          const FaildialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            FaildialogRef.close();
          }, duration);

        }
      }
    });
  }

  Logout(): void {

    this.log.action = "Manually Logged out of the system";
    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.dataService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
        this.router.navigate(['']);
      }
    })

  }

  downloadBackup() {

    if (this.downloadUrl) {

      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      document.body.appendChild(anchor);

      anchor.href = this.downloadUrl;


      anchor.setAttribute('download', 'Backup.bacpac');

      anchor.click();

      document.body.removeChild(anchor);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }




  openBackupTab(): void {
    const userManualUrl = 'assets/PDF/BackupUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
