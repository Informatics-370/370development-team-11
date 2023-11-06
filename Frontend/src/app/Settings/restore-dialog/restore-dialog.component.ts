import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackupComponent } from '../backup/backup.component';
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
  selector: 'app-restore-dialog',
  templateUrl: './restore-dialog.component.html',
  styleUrls: ['./restore-dialog.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class RestoreDialogComponent {
  isLoading: boolean;
  selectedFile: File | null = null;
  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public MydialogRef: MatDialogRef<BackupComponent>, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    }
  }

  onConfirm(): void {

    if (!this.selectedFile) {
      alert('Please select a backup file to restore the database.');
      return;
    }

    this.isLoading = true;;

    this.dataService.restoreDatabase(this.selectedFile).subscribe({
      next: (Response) => {
        this.isLoading = false;
        this.MydialogRef.close();

        var action = 'RESTORE IN PROGRESS';
        var title = 'RESTORE IN PROGRESS';
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
          'Please wait <strong style="color:green">5 SECONDS</strong> for the restore to complete!'
        );

        const NotifdialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });



        setTimeout(() => {
          NotifdialogRef.close();

          var action = 'RESTORE SUCCESSFUL';
          var title = 'Restore Successful';
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
            'The database has been <strong style="color:green">RESTORED</strong> successfully!'
          );

          const Success: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });
          setTimeout(() => {
            Success.close();
            this.Logout()
          }, 1750);
        }, 5000);
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

  onCancel(): void {
    this.MydialogRef.close();
  }



  openRestoreTab(): void {
    const userManualUrl = 'assets/PDF/RestoreUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
