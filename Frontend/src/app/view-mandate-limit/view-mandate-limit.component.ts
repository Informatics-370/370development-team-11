import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteMandateLimitComponent } from '../delete-mandate-limit/delete-mandate-limit.component';


@Component({
  selector: 'app-view-mandate-limit',
  templateUrl: './view-mandate-limit.component.html',
  styleUrls: ['./view-mandate-limit.component.css']
})
export class ViewMandateLimitComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'date', 'action', 'delete'];
  dataSource = new MatTableDataSource<Mandate_Limit>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  Mandate_Limits: Mandate_Limit[] = [];
  SearchedMandate_Limits: Mandate_Limit[] = [];
  searchNumber: Number = 0;
  OnInPutChange() {
    const Searchterm = this.searchNumber;

    if (Searchterm) {
      this.SearchedMandate_Limits = this.Mandate_Limits.filter(mandateLimit => mandateLimit.ammount == Searchterm)
    }
    else if (Searchterm == 0) {
      this.SearchedMandate_Limits = [...this.Mandate_Limits];
    }

    this.dataSource = new MatTableDataSource<Mandate_Limit>(this.SearchedMandate_Limits);
  }

  ngOnInit() {
    this.GetMandateLimits();
  }

  GetMandateLimits() {
    this.dataService.GetMandateLimits().subscribe(result => {
      this.Mandate_Limits = result;
      this.dataSource = new MatTableDataSource(this.Mandate_Limits);
    });
  }
  DeleteMandateLimit(id: Number) {
    const confirm = this.dialog.open(DeleteMandateLimitComponent, {
      disableClose: true,
      data: { id }
    });
  }

}
