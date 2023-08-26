import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuditLog } from '../Shared/AuditLog';
import { Mandate_Limit } from '../Shared/MandateLimit';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-delete-mandate-limit',
  templateUrl: './delete-mandate-limit.component.html',
  styleUrls: ['./delete-mandate-limit.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class DeleteMandateLimitComponent {

  mandateLimit: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249'
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteMandateLimitComponent>, private route: ActivatedRoute, private routee: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id;
        console.log(ID);

        if (ID) {
          this.dataService.GetMandateLimit(ID).subscribe(result => {
            this.mandateLimit = result as Mandate_Limit;
          });
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeleteMandateLimit(id).subscribe({
      next: () => {
        this.log.action = "Deleted Mandate Limit: " + id;
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
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }



  openDeleteMandateTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
