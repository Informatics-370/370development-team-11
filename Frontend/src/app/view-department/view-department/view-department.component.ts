import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/Shared/Department';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteDepartmentComponent } from 'src/app/delete-department/delete-department/delete-department.component';
import { DataService } from 'src/app/DataService/data-service';
import { Employee } from 'src/app/Shared/Employee';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { count } from 'rxjs';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit{
  Departments: Department[] = [];
  Employees: Employee[]=[];
  SearchedDepartment: Department[] = [];
  searchWord: string = "";

  DepartmentToDelete:any  = {
    department_ID :0,
    name:'',
    description:'',
  }

  displayedColumns: string[] = ['department_ID','name', 'description', 'action', 'delete'];
  dataSource = new MatTableDataSource<Department>();
 

  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
    this.GetDepartments();
    console.log(this.Departments)
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();

    if (searchTerm) {
      this.SearchedDepartment = this.Departments.filter(department => department.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedDepartment = [...this.Departments]
    }
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe(result => {
      this.Departments = result;
      this.SearchedDepartment = this.Departments;
    });  
  }
  GetEmployees(){
    this.dataService.GetEmployees().subscribe(result => {
      this.Employees = result;
    })
  }


DeleteDepartment(department_ID: number) {
  this.dataService.GetEmployees().subscribe({
    next: (result) => {
      let EmployeeList: any[] = result
      EmployeeList.forEach((element) => {
        this.Employees.push(element)
      });
      console.log(this.Employees)
      var Count: number = 0;
      this.Employees.forEach(element => {
        if (element.department_ID == department_ID) {
          Count = Count + 1;
          console.log(Count)
        }
      });

      if (Count == 0) {
        const confirm = this.Dialog.open(DeleteDepartmentComponent, {
          disableClose: true,
          data: { department_ID }
        });
      }
      else {

        this.dataService.GetDepartment(department_ID).subscribe({
          next: (DepartmentRecieved) => {
            this.DepartmentToDelete = DepartmentRecieved
          }
        })
        var action = "ERROR";
        var title = "ERROR: Department In Use";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + this.DepartmentToDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH A EMPLOYEE!</strong><br> Please remove the Department from the Employee to continue with deletion.");

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
