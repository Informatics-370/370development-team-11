import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
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
  selector: 'app-create-mandate-limit',
  templateUrl: './create-mandate-limit.component.html',
  styleUrls: ['./create-mandate-limit.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateMandateLimitComponent {
  mandateLimit: Mandate_Limit = {
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
  minDate: Date = new Date()

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.mandateLimitForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      date: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.dataService.AddMandateLimit(this.mandateLimit).subscribe(result => {

      if (result) {
        document.getElementById('AnimationBtn').classList.toggle("is_active");
        document.getElementById('cBtn').style.display = "none";
      }

      this.log.action = "Exported Inventory Details";
      this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
      let test: any
      test = new DatePipe('en-ZA');
      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
      this.dataService.AuditLogAdd(this.log).subscribe({
        next: (Log) => {
          var action = "Create";
          var title = "CREATE SUCCESSFUL";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The mandate limit with amount: R<strong>" + this.mandateLimit.ammount + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

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

  onCancel(): void {
    this.mandateLimitForm.reset();
    this.router.navigate(['/ViewMandateLimit']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.mandateLimitForm.controls[controlName].hasError(errorName);
  }




  openCreateMandateTab(): void {
    const userManualUrl = 'assets/PDF/CreateMandate.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
