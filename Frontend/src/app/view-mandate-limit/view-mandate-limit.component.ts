import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-view-mandate-limit',
  templateUrl: './view-mandate-limit.component.html',
  styleUrls: ['./view-mandate-limit.component.css']
})
export class ViewMandateLimitComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'date', 'action'];
  dataSource = new MatTableDataSource<Mandate_Limit>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  Mandate_Limits: Mandate_Limit[] = [];

  ngOnInit() {
    this.GetMandateLimits();
  }

  GetMandateLimits() {
    this.dataService.GetMandateLimits().subscribe(result => {
      this.dataSource = result;
    });
  }
  // DeleteMandateLimit(ID: Number) {

  // }

}
