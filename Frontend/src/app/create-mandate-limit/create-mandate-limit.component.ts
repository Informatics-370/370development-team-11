import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-mandate-limit',
  templateUrl: './create-mandate-limit.component.html',
  styleUrls: ['./create-mandate-limit.component.css']
})
export class CreateMandateLimitComponent {
  mandateLimit: Mandate_Limit = {
    Mandate_ID: 0,
    Ammount: 0,
    Date: '2023-05-07T12:14:46.249'
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
      this.router.navigate(['/ViewMandateLimit']);
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
