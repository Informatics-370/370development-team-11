import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../Shared/EmployeeRole';

@Component({
  selector: 'app-delete-employee-role',
  templateUrl: './delete-employee-role.component.html',
  styleUrls: ['./delete-employee-role.component.css']
})
export class DeleteEmployeeRoleComponent implements OnInit {

  Role: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(private dialogRef: MatDialogRef<DeleteEmployeeRoleComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id;


        if (ID) {
          this.dataService.GetRole(ID).subscribe(result => {
            this.Role = result
          });
        }
      }
    });


  }

  onConfirm(id: number): void {
    this.dataService.DeleteRole(id).subscribe({
      
        next: (response) => {
          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          setTimeout(() => {
            this.dialogRef.close();
            location.reload();
          }, 2000);
        }
      
    });
  }

  Confirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
