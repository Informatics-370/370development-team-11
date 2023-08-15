import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../Shared/Employee';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css']
})
export class DeleteEmployeeComponent implements OnInit {

  Employee: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

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
          this.log.action = "Deleted Employee: " + this.Employee.employeeName;
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
              }, 1750);
            }
          })

          
        }
        })
    });
  }





  onCancel(): void {
    this.dialogRef.close();
  }
}
