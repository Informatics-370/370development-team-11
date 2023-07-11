import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Consumable } from '../Shared/Consumable';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { Router } from '@angular/router';
import { UpdateConsumableStockComponent } from '../update-consumable-stock/update-consumable-stock.component';


@Component({
  selector: 'app-view-consumable',
  templateUrl: './view-consumable.component.html',
  styleUrls: ['./view-consumable.component.css']
})


export class ViewConsumableComponent implements OnInit {
  Consumables: Consumable[] = [];
  SearchedConsumables: Consumable[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'On Hand', 'Minimum Reorder Quantity', 'Maximum Reorder Quantity', 'Category', 'action', 'update', 'delete'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

  openDialog(name: string, ID: Number) {
    console.log(name)
    this.Dialog.open(UpdateConsumableStockComponent, {
      data: { name, ID }
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedConsumables = this.Consumables.filter(consumable => consumable.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.SearchedConsumables = [...this.Consumables];
    }
  }

  ngOnInit() {
    this.GetConsumables();
    console.log(this.Consumables)

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  GetConsumables() {
    this.dataService.GetConsumables().subscribe(result => {
      let consumableList: any[] = result;
      this.Consumables = [...consumableList];
      this.SearchedConsumables = [...consumableList];
      console.log(this.SearchedConsumables)
      if (result) {
        hideloader();
      }

    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  hoveredButton: number | null = null;


  DeleteConsumable(ID: Number) {
    const confirm = this.Dialog.open(DeleteConsumableComponent, {
      disableClose: true,
      data: { ID }
    });
  }
}
