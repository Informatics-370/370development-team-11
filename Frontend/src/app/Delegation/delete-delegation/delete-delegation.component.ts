import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../DataService/data-service';
import { AuditLog } from '../../Shared/AuditLog';

@Component({
  selector: 'app-delete-delegation',
  templateUrl: './delete-delegation.component.html',
  styleUrls: ['./delete-delegation.component.css']
})
export class DeleteDelegationComponent implements OnInit{

  Delegation: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DeleteDelegationComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;

        if (ID) {
          this.dataService.GetDelegation(ID).subscribe(result => {
            this.Delegation = result;
          })
        }
      }
    })
  }

  onConfirm(id: number): void {
    let sFile = this.Delegation.delegation_Document;
    let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

    if (this.Delegation.delegation_Status.name == "Revoked") {
      this.dataService.DeleteDelegation(id).subscribe({
        next: (response) => {
          this.dataService.DeleteDelegationFile(DelegateName, filename).subscribe(r => {

            this.log.action = "Deleted Delegation: " + this.data.ID;
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
          })
        }
      })
    } else {
      this.dataService.DeleteTempAcc(id).subscribe({
        next: (d) => {
          this.dataService.DeleteDelegation(id).subscribe({
            next: (response) => {
              this.dataService.DeleteDelegationFile(DelegateName, filename).subscribe(r => {
                this.log.action = "Deleted Delegation: " + this.data.ID;
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
              })
            }
          })
        }
      })
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
