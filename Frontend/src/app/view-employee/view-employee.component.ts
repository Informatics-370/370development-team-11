import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { Employee } from '../Shared/Employee';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'username', 'email', 'phone', 'role', 'branch', 'department', 'mandate limit', 'action', 'delete'];
  dataSource = new MatTableDataSource<Employee>();

  userDelete: any
  rl: Role = {
    role_ID: 0,
    name: '',
    description: '',
  }

  UserToDelete: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    role: this.rl
  }

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer) { }

  DeleteEmployees: Employee[] = [];
  Employees: Employee[] = [];
  SearchedEmployee: Employee[] = [];
  searchWord: string = "";

  ngOnInit() {
    this.GetEmployees();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
    console.log(searchTerm);
    console.log(this.Employees)


    if (searchTerm) {
      this.SearchedEmployee = this.Employees.filter(r => r.employeeName.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedEmployee = [...this.Employees]
    }
  } 

  GetEmployees() {
    this.dataService.GetEmployees().subscribe(result => {
      if (result) {
        hideloader();
      }
      this.Employees = result;
      this.SearchedEmployee = this.Employees;
    });
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
  }

  DeleteEmployee(id: Number) {
    const confirm = this.dialog.open(DeleteEmployeeComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
