import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { BudgetCategory } from '../Shared/BudgetCategory';

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
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          location.reload();
        }, 1750);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
