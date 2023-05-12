import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Department } from 'src/app/Shared/Department';

@Component({
  selector: 'app-delete-department',
  templateUrl: './delete-department.component.html',
  styleUrls: ['./delete-department.component.css']
})
export class DeleteDepartmentComponent implements OnInit{
  Department: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteDepartmentComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { department_ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.department_ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetDepartment(ID).subscribe(result => {
            this.Department = result;
            console.log(this.Department);
          });
        }
      }
    });


  }

  onConfirm(ID: number): void {
    this.dataService.DeleteDepartment(ID).subscribe({
      next: (response) => {
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          location.reload();
        }, 1750);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
