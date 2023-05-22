import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { DeleteBudgetCategoryComponent } from '../delete-budget-category/delete-budget-category.component';

@Component({
  selector: 'app-view-budget-category',
  templateUrl: './view-budget-category.component.html',
  styleUrls: ['./view-budget-category.component.css']
})
export class ViewBudgetCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'account_Name', 'description', 'action', 'delete'];
  dataSource = new MatTableDataSource<BudgetCategory>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }
  SearchedBudgetCategories: BudgetCategory[] = [];
  BudgetCategories: BudgetCategory[] = [];
  searchWord: string = '';

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
    this.GetBudgetCategories();
  }

  GetBudgetCategories() {
    this.dataService.GetBudgetCategories().subscribe(result => {
      this.BudgetCategories = result;
      this.dataSource = new MatTableDataSource(this.BudgetCategories);
    });
  }
  DeleteBudgetCategory(id: Number) {
    const confirm = this.dialog.open(DeleteBudgetCategoryComponent, {
      disableClose: true,
      data: { id }
    });
  }

}


