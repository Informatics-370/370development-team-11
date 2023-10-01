import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';


import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-delete-budget-line',
  templateUrl: './delete-budget-line.component.html',
  styleUrls: ['./delete-budget-line.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class DeleteBudgetLineComponent {
  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  category: BudgetCategory = {
    category_ID: 0,
    account_Code: '',
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
    budgetLineId: 0,
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
    budget_Category: this.category,
    month: '2023-05-07',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteBudgetLineComponent>, private route: ActivatedRoute, private router: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id2: Number }) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id2;


        if (ID) {
          this.dataService.GetBudgetLineByID(ID).subscribe(result => {
            this.budgetLine = result as BudgetLine;
          });
        }
      }
    });
  }

  onConfirm(id: Number): void {
    this.dataService.DeleteBudgetLine(id).subscribe({
      next: () => {
        this.log.action = "Deleted Budget Line: " + this.budgetLine.budget_Category.account_Code + " for month: " + this.budgetLine.month;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe({
          next: (Log) => {
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.dialogRef.close('confirm');
            }, 1750);
          }
        })
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }





  openDeleteBLTab(): void {
    const userManualUrl = 'assets/PDF/DeleteLineUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
