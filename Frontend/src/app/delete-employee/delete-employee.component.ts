import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../Shared/Employee';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css']
})
export class DeleteEmployeeComponent implements OnInit {

  Employee: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteEmployeeComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id;
        

        if (ID) {
          this.dataService.GetEmployee(ID).subscribe(result => {
            this.Employee = result
          });
        }
      }
    });


  }

  onConfirm(id: number): void {
    this.dataService.DeleteEmployee(id).subscribe(r => {
      this.dataService.DeleteUser(id).subscribe({
        next: (response) => {
          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          setTimeout(() => {
            this.dialogRef.close();
          }, 1750);
        }
        })
    });
  }





  onCancel(): void {
    this.dialogRef.close();
  }
}
