import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-budget-category',
  templateUrl: './delete-budget-category.component.html',
  styleUrls: ['./delete-budget-category.component.css']
})
export class DeleteBudgetCategoryComponent {

  budgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteBudgetCategoryComponent>, private route: ActivatedRoute, private routee: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id;
        console.log(ID);

        if (ID) {
          this.dataService.GetBudgetCategory(ID).subscribe(result => {
            this.budgetCategory = result as BudgetCategory;
          });
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeleteBudgetCategory(id).subscribe({
      next: () => {
        this.log.action = "Delete Budget Category: " + this.budgetCategory.account_Name;
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
