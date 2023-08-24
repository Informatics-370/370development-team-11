import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
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
    date: '2023-05-07T12:14:46.249'
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  mandateLimitForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.mandateLimitForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      date: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
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
          this.router.navigate(['/ViewMandateLimit']);
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
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
