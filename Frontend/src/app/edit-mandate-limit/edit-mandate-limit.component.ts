import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    console.log(this.currentMandateLimit.mandate_ID)
    this.dataService.EditMandateLimit(this.currentMandateLimit.mandate_ID, this.currentMandateLimit).subscribe(result => {
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
