import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Consumable } from '../Shared/Consumable';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-consumable',
  templateUrl: './view-consumable.component.html',
  styleUrls: ['./view-consumable.component.css']
})


export class ViewConsumableComponent implements OnInit {
  Consumables: Consumable[] = [];
  SearchedConsumables: Consumable[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'On Hand', 'Minimum Reorder Quantity', 'Maximum Reorder Quantity', 'Category', 'action', 'delete'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }
  searchWord: string = '';

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
  }

  GetConsumables() {
    setTimeout(() => {
      this.dataService.GetConsumables().subscribe(result => {
        let ConsumableList: any[] = result
        ConsumableList.forEach((element) => {
          this.Consumables.push(element)
          this.SearchedConsumables.push(element)
        });
      })
    }, 1000);

  }
  hoveredButton: number | null = null;


  DeleteConsumable(ID: Number) {
    const confirm = this.Dialog.open(DeleteConsumableComponent, {
      disableClose: true,
      data: { ID }
    });
  }
}
