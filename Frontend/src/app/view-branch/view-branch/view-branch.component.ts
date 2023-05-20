import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.css']
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

  displayedColumns: string[] = ['branch_ID','name', 'street','city','postal_Code','province', 'action', 'delete'];
  dataSource = new MatTableDataSource<Branch>();
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
    this.GetBranches();
    console.log(this.Branches)
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();

    if (searchTerm) {
      this.SearchedBranch = this.Branches.filter(branch => branch.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedBranch = [...this.Branches]
    }
  }

  GetBranches() {
    this.dataService.GetBranches().subscribe(result => {
      this.Branches = result;
      this.SearchedBranch =this.Branches;
    });  
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





}
