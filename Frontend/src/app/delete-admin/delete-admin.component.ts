import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Admin } from '../Shared/Admin';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-delete-admin',
  templateUrl: './delete-admin.component.html',
  styleUrls: ['./delete-admin.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class DeleteAdminComponent implements OnInit {
  Admin: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  userAccID: any;

  constructor(public dialogRef: MatDialogRef<DeleteAdminComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { userID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.userID;


        if (ID) {
          this.dataService.GetAdmin(ID).subscribe(result => {
            this.Admin = result
            this.dataService.GetUser(ID).subscribe(ru => {
              this.userAccID = ru
            })
          });
        }
      }
    });


  }

  onConfirm(id: number): void {
    this.dataService.DeleteAdmin(id).subscribe(r => {
      this.dataService.DeleteNotifications(id).subscribe(nr => {
        this.dataService.DeleteUser(id).subscribe(uar => {
          this.dataService.DeleteUserAccess(this.userAccID.access_ID).subscribe(ur => {
            this.log.action = "Deleted Admin" + this.Admin.adminName;
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
        })
      })
    });
  }





  onCancel(): void {
    this.dialogRef.close();
  }


  openDeleteAdminTab(): void {
    const userManualUrl = 'assets/PDF/DeleteAdminUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
