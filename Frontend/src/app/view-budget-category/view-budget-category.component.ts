import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetLine } from '../Shared/BudgetLine';
import { DeleteBudgetCategoryComponent } from '../delete-budget-category/delete-budget-category.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-budget-category',
  templateUrl: './view-budget-category.component.html',
  styleUrls: ['./view-budget-category.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewBudgetCategoryComponent implements OnInit {
  displayedColumns: string[] = [ 'account_Name', 'description', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetCategory>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,
    private sanitizer: DomSanitizer) { }
  SearchedBudgetCategories: BudgetCategory[] = [];
  BudgetCategories: BudgetCategory[] = [];
  searchWord: string = '';

  deleteBudgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  BudgetLines: BudgetLine[] = [];

  iRole: string;
  iCanViewFinPro: string = "false";
  canViewFinPro: string;

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedBudgetCategories = this.BudgetCategories.filter(Category => Category.account_Name.toLocaleLowerCase().includes(Searchterm))
      this.dataSource = new MatTableDataSource(this.SearchedBudgetCategories);
    }
    else if (Searchterm == "") {
      this.SearchedBudgetCategories = [...this.BudgetCategories];
      this.dataSource = new MatTableDataSource(this.SearchedBudgetCategories);
    }
  }



  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanViewFinPro = this.dataService.decodeCanViewFinPro(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iCanViewFinPro == "true") {
      this.canViewFinPro = "true";
    }

    this.GetBudgetCategories();
  }

  GetBudgetCategories() {
    this.dataService.GetBudgetCategories().subscribe(result => {
      this.BudgetCategories = result;
      this.dataSource = new MatTableDataSource(this.BudgetCategories);
    });
  }
  DeleteBudgetCategory(id: Number) {
    this.dataService.GetBudgetLines().subscribe({
      next: (result) => {
        let LineList: any[] = result
        LineList.forEach((element) => {
          this.BudgetLines.push(element)
        });
        console.log(this.BudgetLines)
        var Count: number = 0;
        this.BudgetLines.forEach(element => {
          if (element.category_ID == id) {
            Count = Count + 1;
            console.log(Count)
          }
        });

        if (Count == 0) {
          const confirm = this.dialog.open(DeleteBudgetCategoryComponent, {
            disableClose: true,
            data: { id }
          });
        }
        else {

          this.dataService.GetBudgetCategory(id).subscribe({
            next: (categoryReceived) => {
              this.deleteBudgetCategory = categoryReceived as BudgetCategory;
            }
          })
          var action = "ERROR";
          var title = "ERROR: Budget Category In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Category <strong>" + this.deleteBudgetCategory.account_Name + " <strong style='color:red'>IS ASSOCIATED WITH A BUDGET LINE!</strong><br> Please remove the budget category from the budget line to continue with deletion.");

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


