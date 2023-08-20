import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consumable } from '../Shared/Consumable';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-delete-consumable',
  templateUrl: './delete-consumable.component.html',
  styleUrls: ['./delete-consumable.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class DeleteConsumableComponent implements OnInit {
  Consumables: Consumable = {
    consumable_ID: 0,
    consumable_Category_ID: 0,
    name: '',
    description: '',
    on_Hand: 0,
    minimum_Reorder_Quantity: 0,
    maximum_Reorder_Quantity: 0,
    consumable_Category: { consumable_Category_ID: 0, name: "", description: "" }
  }
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DeleteConsumableComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;

        if (ID) {
          this.dataService.GetConsumableByID(ID).subscribe(result => {
            this.Consumables = result;
          });
        }
      }
    });


  }

  onConfirm(id: number): void {
    this.dataService.DeleteConsumable(id).subscribe({
      next: (response) => {
        this.log.action = "Deleted Consumable: " + this.Consumables.name;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe({
          next: (response) => {
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.dialogRef.close();
              this.route.navigate(['/ViewConsumable']);
            }, 1750);
          }
        })

      }
    });
  }





  onCancel(): void {
    this.dialogRef.close();
  }



  openDeleteConTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
