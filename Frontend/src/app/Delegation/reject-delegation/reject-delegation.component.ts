import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../DataService/data-service';

@Component({
  selector: 'app-reject-delegation',
  templateUrl: './reject-delegation.component.html',
  styleUrls: ['./reject-delegation.component.css']
})
export class RejectDelegationComponent implements OnInit {
  statuses: any[] = []
  delID: any

  myForm: FormGroup = new FormGroup({});
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<RejectDelegationComponent>, private formBuilder: FormBuilder, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit() {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        this.delID = this.data.ID;
        console.log(this.delID)
        console.log(this.data.ID)

      }
    });

    this.myForm = this.formBuilder.group({
      Status_ID: ['', [Validators.required]]
    })

    this.GetStatuses();
  }

  GetStatuses() {
    this.dataService.GetStatuses().subscribe(r => {
      this.statuses = r;
    })
  }

  onSubmit(id: number): void {
    let statusID = this.myForm.get('Status_ID')?.value;

    this.dataService.EditDelegationStatus(statusID, this.delID).subscribe(r => {
      this.showConfirmationDialog = false;
      this.showSuccessDialog = true;
      setTimeout(() => {
        this.dialogRef.close();
      }, 1750);
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
