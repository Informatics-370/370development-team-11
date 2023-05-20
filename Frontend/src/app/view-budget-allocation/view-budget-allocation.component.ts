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
  displayedColumns: string[] = ['id', 'department', 'date', 'year', 'total', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetAllocation>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  ngOnInit() {
    this.GetBudgetAllocations();
  }

  GetBudgetAllocations() {
    this.dataService.GetBudgetAllocations().subscribe(result => {
      this.dataSource = result;
    });
  }
  DeleteBudgetAllocation(id: Number) {
    const confirm = this.dialog.open(DeleteBudgetAllocationComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
