import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { DeleteBudgetLineComponent } from '../delete-budget-line/delete-budget-line.component';

@Component({
  selector: 'app-view-budget-lines',
  templateUrl: './view-budget-lines.component.html',
  styleUrls: ['./view-budget-lines.component.css']
})
export class ViewBudgetLinesComponent {

  id: Number = 0;
  BudgetLines: BudgetLine[] = [];
  SearchedBudgetLines: BudgetLine[] = [];
  searchTerm: String = '';
  displayedColumns: string[] = ['id', 'budgetCategory', 'month', 'budget', 'actual', 'variance', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetLine>();

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private dataService: DataService) { }

  OnInPutChange() {
    const Searchterm = this.searchTerm.toLowerCase();

    if (Searchterm) {
      this.SearchedBudgetLines = this.BudgetLines.filter(budgetLine => budgetLine.budget_Category.account_Name.toLowerCase().includes(Searchterm));
      this.dataSource = new MatTableDataSource(this.SearchedBudgetLines);
    }
    else if (Searchterm == "") {
      this.SearchedBudgetLines = [...this.BudgetLines];
      this.dataSource = new MatTableDataSource(this.BudgetLines);
    }

    this.dataSource = new MatTableDataSource<BudgetLine>(this.SearchedBudgetLines);
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetLines(id);
    this.id = id;
  }

  GetBudgetLines(id: number) {
    this.dataService.GetBudgetLineItems(id).subscribe(result => {
      this.BudgetLines = result;
      this.dataSource = new MatTableDataSource(this.BudgetLines);
    });
  }
  AddBudgetLine() {
    this.router.navigate(['/AddBudgetLine', this.id]);
  }

  EditBudgetLine(id: Number, id2: Number) {
    this.router.navigate(['/EditBudgetLine', id, id2]);
  }



  DeleteBudgetLine(id2: Number) {
    const confirm = this.dialog.open(DeleteBudgetLineComponent, {
      disableClose: true,
      data: { id2 }
    });
    confirm.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.dataService.DeleteBudgetLine(id2).subscribe(() => {
          this.dataService.GetBudgetAllocation(this.id).subscribe((budgetAllocation: BudgetAllocation) => {
            this.dataService.GetBudgetLineItems(this.id).subscribe(budgetLineItems => {
              let totalBudgetLinesAmount = budgetLineItems.reduce((prev, cur) => prev + Number(cur.budgetAmt), 0);
              if (totalBudgetLinesAmount <= budgetAllocation.total) {
                this.GetBudgetLines(Number(this.id)); // Refresh budget lines
              } else {
              }
            });
          });
        });
      }
    });
  }
}
