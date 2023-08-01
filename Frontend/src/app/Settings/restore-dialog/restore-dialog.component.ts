import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackupComponent } from '../backup/backup.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { FormBuilder } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-restore-dialog',
  templateUrl: './restore-dialog.component.html',
  styleUrls: ['./restore-dialog.component.css']
})
export class RestoreDialogComponent {
  isLoading: boolean;
  selectedFile: File | null = null;


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

    this.isLoading = true;


    this.dataService.restoreDatabase(this.selectedFile).subscribe({
      next: (Response) => {
        if (Response) {
          console.log(Response)
          this.isLoading = false;
          this.MydialogRef.close();

          var action = 'RESTORE SUCCESSFUL';
          var title = 'Restore Successful';
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
            'The database has been <strong style="color:green">RESTORED</strong> successfully!'
          );

          const NotifdialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });



          setTimeout(() => {
            NotifdialogRef.close();
          }, 1750);
        }
      }
    });
  }

  onCancel(): void {
    this.MydialogRef.close();
  }
}
