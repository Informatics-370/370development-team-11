import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../DataService/data-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { NotificationdisplayComponent } from '../../notificationdisplay/notificationdisplay.component';
import { VAT } from '../../Shared/VAT';

@Component({
  selector: 'app-edit-vat',
  templateUrl: './edit-vat.component.html',
  styleUrls: ['./edit-vat.component.css']
})
export class EditVatComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<EditVatComponent>, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  myForm: FormGroup = new FormGroup({});

  vat: VAT = {
    VatID: 0,
    Percentage: 0,
    Date: new Date()
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  eVat: any

  ngOnInit(): void {
    this.myForm = new FormGroup({
      percentage: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$"),])
    });

    this.dataservice.GetVAT().subscribe(res => {
      this.eVat = res;
      this.myForm.patchValue({
        percentage: this.eVat.percentage
      })

      this.vat.Percentage = this.eVat.percentage;
      this.vat.Date = this.eVat.date;
    })
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');

    var percent = this.myForm.get('percentage')?.value;

    let startDate: any
    startDate = new DatePipe('en-ZA');
    var date = startDate.transform(Date(), 'MMM d, y, h:mm:ss a');

    this.vat.Percentage = percent;
    this.vat.Date = date;

    this.dataservice.GetVAT().subscribe(re => {
      if (re != null) {
        if (re.percentage == this.vat.Percentage) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to VAT: <strong>" + percent + "%</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
            this.dialogRef.close();
          }, duration);
        } else {
          this.dataservice.EditVAT(this.vat).subscribe(r => {
            if (r) {
              document.getElementById('AnimationBtn').classList.toggle("is_active");
              document.getElementById('cBtn').style.display = "none";
              this.log.action = "Edited VAT: " + percent;
              this.log.user = this.dataservice.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataservice.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "EDIT";
                  var title = "EDIT SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The VAT with percentage <strong>" + percent + "%</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    dialogRef.close();
                    this.dialogRef.close();
                  }, duration);
                }
              })
            }
          })
        }
      }
    })

  }

  Close() {
    this.dialogRef.close()
  }
}
