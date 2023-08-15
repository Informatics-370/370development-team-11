import { Component, OnInit, ViewChild } from '@angular/core';
import { Consumable } from '../Shared/Consumable';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { Router } from '@angular/router';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { DeleteConsumableCategoryComponent } from '../delete-consumable-category/delete-consumable-category.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { count } from 'rxjs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-consumable-category',
  templateUrl: './view-consumable-category.component.html',
  styleUrls: ['./view-consumable-category.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewConsumableCategoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ConsumableCategories: ConsumableCategory[] = [];
  Consumables: Consumable[] = []
  displayedColumns: string[] = ['Name', 'Description', 'action', 'delete'];
  SearchedConsumableCategories: ConsumableCategory[] = []
  dataSource: any;

  CategoryToDelete: ConsumableCategory = {
    consumable_Category_ID: 0,
    name: '',
    description: '',
  }



  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  searchWord: string = '';

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.dataSource = this.ConsumableCategories.filter(Category => Category.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.GetCategories();
    }
  }
  ngOnInit(): void {
    this.GetCategories()
  }

  GetCategories() {
    this.dataService.GetCategories().subscribe(result => {
      let categoryList: any[] = result;
      this.ConsumableCategories = [...categoryList];
      this.SearchedConsumableCategories = [...categoryList];
      this.dataSource = new MatTableDataSource(this.ConsumableCategories.filter((value, index, self) => self.map(x => x.consumable_Category_ID).indexOf(value.consumable_Category_ID) == index));
      this.dataSource.paginator = this.paginator

      if (result) {
        hideloader();
      }
    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }


  GetConsumables() {
    this.dataService.GetConsumables().subscribe(result => {
      let ConsumableList: any[] = result
      ConsumableList.forEach((element) => {
        this.Consumables.push(element)
      });
    })
  }
  hoveredButton: number | null = null;
  DeleteCategory(ID: Number) {
    this.dataService.GetConsumables().subscribe({
      next: (result) => {
        let ConsumableList: any[] = result
        ConsumableList.forEach((element) => {
          this.Consumables.push(element)
        });
        console.log(this.Consumables)
        var Count: number = 0;
        this.Consumables.forEach(element => {
          if (element.consumable_Category_ID == ID) {
            Count = Count + 1;
            console.log(Count)
          }
        });

        if (Count == 0) {
          const confirm = this.Dialog.open(DeleteConsumableCategoryComponent, {
            disableClose: true,
            data: { ID }
          });
        }
        else {

          this.dataService.GetCategoryByID(ID).subscribe({
            next: (CategoryRecieved) => {
              this.CategoryToDelete = CategoryRecieved
            }
          })
          var action = "ERROR";
          var title = "ERROR: Category In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.CategoryToDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH A CONSUMABLE!</strong><br> Please remove the category from the consumable to continue with deletion.");

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
