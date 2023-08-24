import { Component, OnInit, ViewChild } from '@angular/core';
import { Branch } from 'src/app/Shared/Branch';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteBranchComponent } from 'src/app/delete-branch/delete-branch/delete-branch.component';
import { DataService } from 'src/app/DataService/data-service';
import { Employee } from 'src/app/Shared/Employee';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { count } from 'rxjs';
import { RestoreComponent } from 'src/app/Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from 'src/app/Settings/restore-dialog/restore-dialog.component';
import { BranchIFrameComponent } from 'src/app/HelpIFrames/BranchIFrame/branch-iframe/branch-iframe.component';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.css'], 
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewBranchComponent implements OnInit {
  Branches: Branch[] = [];
  Employees: Employee[]=[];
  SearchedBranch: Branch[] = [];
  searchWord: string = "";

  BranchToDelete: any  = {
    branch_ID :0,
    name:'',
    street:'',
    city:'',
    postal_Code:'',
    province:'',
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'street','city','postal_Code','province', 'action', 'delete'];
  dataSource : any;
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
    this.GetBranches();
    console.log(this.Branches)
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();

    if (searchTerm) {
      this.dataSource = this.Branches.filter(branch => branch.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.GetBranches();
    }
  }

  GetBranches() {
    this.dataService.GetBranches().subscribe(result => {
      let employeeList: any[] = result;
      this.Branches = [...employeeList];
      this.SearchedBranch = [...employeeList];
      this.dataSource = new MatTableDataSource(this.Branches.filter((value, index, self) => self.map(x => x.branch_ID).indexOf(value.branch_ID) == index));
      this.dataSource.paginator = this.paginator

      if (result) {
        hideloader();
      }

    }); 
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }  
  }
  GetEmployees(){
    this.dataService.GetEmployees().subscribe(result => {
      this.Employees = result;
    })
  }

  DeleteBranch(branch_ID: number) {
    this.dataService.GetEmployees().subscribe({
      next: (result) => {
        let EmployeeList: any[] = result
        EmployeeList.forEach((element) => {
          this.Employees.push(element)
        });
        console.log(this.Employees)
        var Count: number = 0;
        this.Employees.forEach(element => {
          if (element.branch_ID == branch_ID) {
            Count = Count + 1;
            console.log(Count)
          }
        });
  
        if (Count == 0) {
          const confirm = this.Dialog.open(DeleteBranchComponent, {
            disableClose: true,
            data: { branch_ID }
          });
        }
        else {
  
          this.dataService.GetBranch(branch_ID).subscribe({
            next: (BranchRecieved) => {
              this.BranchToDelete = BranchRecieved
            }
          })
          var action = "ERROR";
          var title = "ERROR: Branch In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + this.BranchToDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH A EMPLOYEE!</strong><br> Please remove the Branch from the Employee to continue with deletion.");
  
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



  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRestoreDialog() {
    const dialogRef = this.dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openBranchIFrameTab(): void {
    const dialogRef = this.dialog.open(BranchIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }

}
