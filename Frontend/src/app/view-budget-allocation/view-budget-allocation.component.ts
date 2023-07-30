import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { BudgetLine } from '../Shared/BudgetLine';
import { Department } from '../Shared/Department';
import { DeleteBudgetAllocationComponent } from '../delete-budget-allocation/delete-budget-allocation.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-budget-allocation',
  templateUrl: './view-budget-allocation.component.html',
  styleUrls: ['./view-budget-allocation.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewBudgetAllocationComponent {

  BudgetLines: BudgetLine[] = [];
  BudgetAllocations: BudgetAllocation[] = [];
  SearchedBudgetAllocations: BudgetAllocation[] = [];
  searchNumber: Number = 0;
  displayedColumns: string[] = [ 'department', 'date', 'year', 'total', 'lines', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetAllocation>();

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  deleteBudgetAllocation: BudgetAllocation = {
    budget_ID: 0,
    department_ID: 0,
    date_Created: '2023-05-07T12:14:46.249Z',
    year: 0,
    total: 0,
    department: this.dep
  }



  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,
    private sanitizer: DomSanitizer) { }

  OnInPutChange() {
    const Searchterm = this.searchNumber;

    if (Searchterm) {
      this.SearchedBudgetAllocations = this.BudgetAllocations.filter(budgetAllocation => budgetAllocation.year == Searchterm)
      this.dataSource = new MatTableDataSource(this.SearchedBudgetAllocations);
    }
    else if (Searchterm == 0) {
      this.SearchedBudgetAllocations = [...this.BudgetAllocations];
      this.dataSource = new MatTableDataSource(this.SearchedBudgetAllocations);
    }

    this.dataSource = new MatTableDataSource<BudgetAllocation>(this.SearchedBudgetAllocations);
  }

  ngOnInit() {
    this.GetBudgetAllocations();
  }

  GetBudgetAllocations() {
    this.dataService.GetBudgetAllocations().subscribe(result => {
      this.BudgetAllocations = result;
      this.dataSource = new MatTableDataSource(this.BudgetAllocations);
    });
  }
  DeleteBudgetAllocation(id: Number) {
    this.dataService.GetBudgetLines().subscribe({
      next: (result) => {
        let LineList: any[] = result
        LineList.forEach((element) => {
          this.BudgetLines.push(element)
        });
        console.log(this.BudgetLines)
        var Count: number = 0;
        this.BudgetLines.forEach(element => {
          if (element.budget_ID == id) {
            Count = Count + 1;
            console.log(Count)
          }
        });

        if (Count == 0) {
          const confirm = this.dialog.open(DeleteBudgetAllocationComponent, {
            disableClose: true,
            data: { id }
          });
        }
        else {

          this.dataService.GetBudgetAllocation(id).subscribe({
            next: (allocationReceived) => {
              this.deleteBudgetAllocation = allocationReceived as BudgetAllocation;
            }
          })
          var action = "ERROR";
          var title = "ERROR: Budget Allocation In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for year <strong> " + this.deleteBudgetAllocation.year + " <strong style='color:red'>IS ASSOCIATED WITH A BUDGET LINE!</strong><br> Please remove the budget allocation from the budget line to continue with deletion.");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 4000;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })
  }
}
