import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-mandate-limit',
  templateUrl: './edit-mandate-limit.component.html',
  styleUrls: ['./edit-mandate-limit.component.css']
})
export class EditMandateLimitComponent {
  currentMandateLimit: Mandate_Limit = {
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

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

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
      }
    });
  }

  onSubmit(): void {
    console.log(this.currentMandateLimit)
    this.dataService.EditMandateLimit(this.currentMandateLimit.mandate_ID, this.currentMandateLimit).subscribe(result => {
      document.getElementById('cBtn').style.display = "none";
      document.querySelector('button').classList.toggle("is_active");

      this.log.action = "Mandate Limit Updated: " + this.currentMandateLimit.ammount;
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
}
