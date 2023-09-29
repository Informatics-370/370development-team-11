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
  selector: 'app-create-vat',
  templateUrl: './create-vat.component.html',
  styleUrls: ['./create-vat.component.css']
})
export class CreateVatComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<CreateVatComponent>, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

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

  ngOnInit(): void {
    this.myForm = new FormGroup({
      percentage: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+$"),])
    });
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
      if (re == null) {
        this.dataservice.AddVAT(this.vat).subscribe(r => {
          if (r) {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";
            this.log.action = "Created VAT: " + percent;
            this.log.user = this.dataservice.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataservice.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                var action = "CREATE";
                var title = "CREATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The VAT with percentage <strong>" + percent + "</strong>% has been <strong style='color:green'> CREATED </strong> successfully!");

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
      } else {
        document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
        var action = "ERROR";
        var title = "ERROR: VAT Exists";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exists a <strong style='color:red'> VAT!</strong>");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      }
    })

  }

  Close() {
    this.dialogRef.close()
  }
}
