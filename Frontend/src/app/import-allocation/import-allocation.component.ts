import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-import-allocation',
  templateUrl: './import-allocation.component.html',
  styleUrls: ['./import-allocation.component.css']
})
export class ImportAllocationComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<ImportAllocationComponent>, private sanitizer: DomSanitizer, private dialog: MatDialog) { }
  myForm: FormGroup = new FormGroup({});
  fileToUpload: File | null = null;
  files: File[] = [null];

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  onFile1Upload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      File: ["", [Validators.required]],
    })
  }

  onSubmit() {
    this.dataservice.ImportBudgetAllocation(this.fileToUpload).subscribe({
      next: (Response) => {
        if (Response != null) {
          this.log.action = "Imported Allocation for: " + Response.department.description;
          this.log.user = this.dataservice.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataservice.AuditLogAdd(this.log).subscribe({
            next: (Result) => {
              var action = "Import";
              var title = "IMPORT SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The budget allocation has been <strong style='color:green'> IMPORTED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                dialogRef.close();
              }, duration);
              this.dialogRef.close()
            }
          })
        }
        else {
          var action = "Import";
          var title = "IMPORT FAILED";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The budget allocation already <strong style='color:red'> EXISTS! </strong>");

          const Notif: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            Notif.close();
          }, duration);
        }
      },
      error: (error) => {
        var action = "Import";
        var title = "IMPORT FAILED";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The budget allocation <strong style='color:red'> FAILED </strong> to import! <br> <strong>Please ensure that the document is in the correct format!</strong>");

        const Notif: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          Notif.close();
        }, duration);
      }
    })
  }

  Close(event: Event) {
    event.preventDefault();
    this.dialogRef.close()
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}
