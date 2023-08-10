import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../Shared/EmployeeRole';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-employee-role',
  templateUrl: './delete-employee-role.component.html',
  styleUrls: ['./delete-employee-role.component.css']
})
export class DeleteEmployeeRoleComponent implements OnInit {

  Role: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

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

        this.log.action = "Deleted Employee Role: " + this.Role.name;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe({
          next: (Log) => {
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          }
        })
          
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
