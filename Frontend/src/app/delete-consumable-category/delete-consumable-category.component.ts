import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { DatePipe } from '@angular/common';
import { AuditLog } from '../Shared/AuditLog';

@Component({
  selector: 'app-delete-consumable-category',
  templateUrl: './delete-consumable-category.component.html',
  styleUrls: ['./delete-consumable-category.component.css']
})
export class DeleteConsumableCategoryComponent implements OnInit {

  ConsumableCategory: ConsumableCategory = {
    consumable_Category_ID: 0,
    name: '',
    description: '',
  }
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DeleteConsumableCategoryComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetCategoryByID(ID).subscribe(result => {
            this.ConsumableCategory = result;
          });
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeleteCategory(id).subscribe({
      next: (response) => {
        this.log.action = "Deleted Consumable Category: " + this.ConsumableCategory.name;
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
              location.reload();
            }, 1750);
          }
        })

      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
