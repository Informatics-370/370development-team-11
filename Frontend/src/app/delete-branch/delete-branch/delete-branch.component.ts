import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Branch } from 'src/app/Shared/Branch';

@Component({
  selector: 'app-delete-branch',
  templateUrl: './delete-branch.component.html',
  styleUrls: ['./delete-branch.component.css']
})
export class DeleteBranchComponent implements OnInit{
  Branch: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteBranchComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { branch_ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.branch_ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetBranch(ID).subscribe(result => {
            this.Branch = result;
          });
        }
      }
    });


  }

  onConfirm(ID: number): void {
    this.dataService.DeleteBranch(ID).subscribe({
      next: (response) => {
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          this.route.navigate(['/ViewBranch'], { queryParams: { refresh: true } });
          location.reload();
        }, 1750);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
