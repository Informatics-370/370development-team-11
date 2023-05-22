import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { DeleteBudgetAllocationComponent } from '../delete-budget-allocation/delete-budget-allocation.component';

@Component({
  selector: 'app-view-budget-allocation',
  templateUrl: './view-budget-allocation.component.html',
  styleUrls: ['./view-budget-allocation.component.css']
})
export class ViewBudgetAllocationComponent {

  BudgetAllocations: BudgetAllocation[] = [];
  SearchedBudgetAllocations: BudgetAllocation[] = [];
  searchNumber: Number = 0;
  displayedColumns: string[] = ['id', 'department', 'date', 'year', 'total', 'lines', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetAllocation>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

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
    const confirm = this.dialog.open(DeleteBudgetAllocationComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
