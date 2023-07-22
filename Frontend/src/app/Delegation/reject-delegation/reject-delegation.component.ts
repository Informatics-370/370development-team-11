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
  Delegation: any;
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

      }
    });

    this.GetDelegation();
  }

  GetDelegation() {
    this.dataService.GetDelegation(this.delID).subscribe(r => {
      this.Delegation = r;
    })
  }

  status: any;

  onConfirm(id: number): void {
    this.dataService.GetRevokeStatus().subscribe(r => {
      this.status = r;
      console.log(r)
      let statusID = this.status.status_ID;
      console.log(statusID)

      this.dataService.EditDelegationStatus(statusID, this.delID).subscribe(r => {
        this.dataService.DeleteTempAcc(this.delID).subscribe(x => {
          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          setTimeout(() => {
            this.dialogRef.close();
          }, 1750);
        })
      })
    })


    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
