import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';



@Component({
  selector: 'app-delete-budget-line',
  templateUrl: './delete-budget-line.component.html',
  styleUrls: ['./delete-budget-line.component.css']
})
export class DeleteBudgetLineComponent {
  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  category: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  budgetAllocation: BudgetAllocation = {
    budget_ID: 0,
    department_ID: 0,
    date_Created: '2023-05-07T12:14:46.249Z',
    year: 0,
    total: 0,
    department: this.dep
  }


  budgetLine: BudgetLine = {
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
    account_Code: 0,
    budget_Category: this.category,
    month: '2023-05-07',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteBudgetLineComponent>, private route: ActivatedRoute, private routee: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id2: number }) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id2;
        console.log(ID);

        if (ID) {
          this.dataService.GetBudgetLine(ID).subscribe(result => {
            this.budgetLine = result as BudgetLine;
          });
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeleteBudgetLine(id).subscribe({
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
