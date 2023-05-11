import { Component, OnInit } from '@angular/core';
import { Branch } from 'src/app/Shared/Branch';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteBranchComponent } from 'src/app/delete-branch/delete-branch/delete-branch.component';
import { DataService } from 'src/app/DataService/data-service';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.css']
})
export class ViewBranchComponent implements OnInit {
  Branches: Branch[] = [];
  displayedColumns: string[] = ['branch_ID','name', 'street','city','postal_Code','province', 'action', 'delete'];
  dataSource = new MatTableDataSource<Branch>();
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.GetBranches();
    console.log(this.Branches)
  }

 

  GetBranches() {
    this.dataService.GetBranches().subscribe(result => {
      this.dataSource = result;
    });  
  }

  DeleteBranch(branch_ID: Number) {
    const confirm = this.Dialog.open(DeleteBranchComponent, {
      disableClose: true,
      data: { branch_ID }
    });
  }
}
