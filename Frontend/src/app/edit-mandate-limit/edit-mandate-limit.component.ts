import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-mandate-limit',
  templateUrl: './edit-mandate-limit.component.html',
  styleUrls: ['./edit-mandate-limit.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditMandateLimitComponent {
  currentMandateLimit: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: ''
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  mandateLimitForm: FormGroup = new FormGroup({});
  minDate: Date;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetMandateLimit(id);
    this.mandateLimitForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      date: ['', [Validators.required]]
    })

  }
  GetMandateLimit(id: number) {
    this.dataService.GetMandateLimit(id).subscribe({
      next: (MandateLimit: Mandate_Limit) => {
        this.currentMandateLimit = MandateLimit;
        this.minDate = new Date(this.currentMandateLimit.date.toString())
      }
    });
  }

  onSubmit(): void {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.dataService.EditMandateValidation(this.currentMandateLimit.ammount).subscribe(r => {
      if (r == null) {
        this.dataService.EditMandateLimit(this.currentMandateLimit.mandate_ID, this.currentMandateLimit).subscribe(result => {
          document.getElementById('AnimationBtn').classList.toggle("is_active");
          document.getElementById('cBtn').style.display = "none";

          this.log.action = "Mandate Limit Updated: " + this.currentMandateLimit.ammount;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The mandate limit with amount: R<strong>" + this.currentMandateLimit.ammount + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/ViewMandateLimit']);
                dialogRef.close();
              }, duration);
              
            }
          })


        });
      }
      else if (r.ammount == this.currentMandateLimit.ammount && r.date == this.currentMandateLimit.date && r.mandate_ID == this.currentMandateLimit.mandate_ID) {
        var action = "NOTIFICATION";
        var title = "NOTIFICATION: NO CHANGES MADE";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to Mandate Limit with amount: R<strong>" + this.currentMandateLimit.ammount + "</strong>");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewMandateLimit']);
          dialogRef.close();
        }, duration);
      }
      else if (r.ammount == this.currentMandateLimit.ammount && r.date != this.currentMandateLimit.date && r.mandate_ID == this.currentMandateLimit.mandate_ID) {
        this.dataService.EditMandateLimit(this.currentMandateLimit.mandate_ID, this.currentMandateLimit).subscribe(result => {
          document.getElementById('AnimationBtn').classList.toggle("is_active");
          document.getElementById('cBtn').style.display = "none";

          this.log.action = "Mandate Limit Updated: " + this.currentMandateLimit.ammount;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The mandate limit with amount: R<strong>" + this.currentMandateLimit.ammount + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/ViewMandateLimit']);
                dialogRef.close();
              }, duration);
            }
          })


        });
      }
      else {
        var action = "ERROR";
        var title = "ERROR: Mandate Limit Exists";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("A Mandate Limit with amount: R<strong>" + this.currentMandateLimit.ammount + "<strong style='color:red'> ALREADY EXISTS!</strong>");

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

  onCancel(): void {
    this.mandateLimitForm.reset();
    this.router.navigate(['/ViewMandateLimit']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.mandateLimitForm.controls[controlName].hasError(errorName);
  }







  openEditMandateTab(): void {
    const userManualUrl = 'assets/PDF/EditMandate.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
