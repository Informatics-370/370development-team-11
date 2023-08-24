import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { DeleteBudgetLineComponent } from '../delete-budget-line/delete-budget-line.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { BudgetLineIFrameComponent } from '../HelpIFrames/BudgetLineIFrame/budget-line-iframe/budget-line-iframe.component';
import { MatPaginator } from '@angular/material/paginator';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-budget-lines',
  templateUrl: './view-budget-lines.component.html',
  styleUrls: ['./view-budget-lines.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewBudgetLinesComponent {

  id: Number = 0;
  BudgetLines: BudgetLine[] = [];
  SearchedBudgetLines: BudgetLine[] = [];
  searchTerm: String = '';
  displayedColumns: string[] = ['budgetCategory', 'month', 'budget', 'actual', 'variance', 'action', 'delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filters: any[] = ["None", "Category", "Month"]
  searchWord: string = "None";

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private dataService: DataService) { }

  OnInPutChange() {
    const Searchterm = this.searchTerm.toLowerCase();

    if (Searchterm) {
      this.dataSource = this.BudgetLines.filter(budgetLine => budgetLine.budget_Category.account_Name.toLowerCase().includes(Searchterm));
    }
    else if (Searchterm == "") {
      console.log(Number(this.route.snapshot.paramMap.get('id')))
      this.GetBudgetLines(Number(this.route.snapshot.paramMap.get('id')));
    }
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetLines(id);
    this.id = id;
  }

  GetBudgetLines(id: number) {
    this.dataService.GetBudgetLineItems(id).subscribe(result => {
      let employeeList: any[] = result;
      this.BudgetLines = [...employeeList];
      this.dataSource = new MatTableDataSource(this.BudgetLines.filter((value, index, self) => self.map(x => x.budgetLineId).indexOf(value.budgetLineId) == index));
      this.dataSource.paginator = this.paginator
    });
  }

  RefreshBLs() {
    this.dataService.GetBudgetLineItems(Number(this.route.snapshot.paramMap.get('id'))).subscribe(result => {
      let BLList: any[] = result;
      this.BudgetLines = [...BLList];
      console.log(this.BudgetLines)
    });
  }

  OnInPutChangeS() {
    const Searchterm = this.searchWord; // Use this.selectedFilter instead of this.searchWord

    if (Searchterm === "Category") {
      this.RefreshBLs()
      this.dataSource = this.BudgetLines.sort((a, b) => {
        if (a.budget_Category.account_Name < b.budget_Category.account_Name) {
          return -1;
        } else if (a.budget_Category.account_Name > b.budget_Category.account_Name) {
          return 1;
        }
        return 0;
      });

      this.dataSource = new MatTableDataSource(this.BudgetLines.filter((value, index, self) => self.map(x => x.budgetLineId).indexOf(value.budgetLineId) == index));
      this.dataSource.paginator = this.paginator
    }
    else if (Searchterm === "Month") {
      this.RefreshBLs()
      this.dataSource = this.BudgetLines.sort((a, b) => {
        const monthOrder: String[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

      this.dataSource = new MatTableDataSource(this.BudgetLines.filter((value, index, self) => self.map(x => x.budgetLineId).indexOf(value.budgetLineId) == index));
      this.dataSource.paginator = this.paginator
    }
    else if (Searchterm === "None") {
      this.GetBudgetLines(Number(this.route.snapshot.paramMap.get('id')));
    }
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
      this.ngOnInit()
    });
  }



  openBudgetLineIFrameTab(): void {
    const dialogRef = this.dialog.open(BudgetLineIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
