import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackdropOptions } from 'chart.js';
import { BackupComponent } from '../backup/backup.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css'],
  
})
export class RestoreComponent {
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;
  backupStatus: string;
  isLoading: boolean;

 
  constructor(public dialogRef: MatDialogRef<BackupComponent>,private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  onConfirm(): void {
    this.isLoading = true;

    this.dataService.createBackup().subscribe({
      next: (response) => {
        if (response){

        
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        this.isLoading = false;

        var action = 'RESTORE SUCCESSFUL';
        var title = 'Backup Successful';
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
          'The <strong>Backup</strong> has been <strong style="color:green">CREATED</strong> successfully!'
        );
        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });
        setTimeout(() => {
          this.dialogRef.close();
        location.reload();
        }, 1750);
      }else{
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


  onCancel(): void {
    this.dialogRef.close();
  }
}
