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
import { OnboardRequest } from '../Shared/OnboardRequest';


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

  RoleToUse: string = "";

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer) { }

  DeleteEmployees: Employee[] = [];
  Employees: Employee[] = [];
  SearchedEmployee: Employee[] = [];
  Users: User[] = [];
  OnboardRequests: OnboardRequest[] = [];
  searchWord: string = "";

  ngOnInit() {
    this.RoleToUse = localStorage.getItem("Role")
    console.log(this.RoleToUse)
    console.log(this.RoleToUse === "\"Admin\"")

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
    this.dataService.GetAllOnboardRequest().subscribe({
      next: (result) => {
        let UserList: any[] = result
        UserList.forEach((element) => {
          this.OnboardRequests.push(element)
        });
        var Count: number = 0;
        this.OnboardRequests.forEach(element => {
          if (element.user_Id == id) {
            Count = Count + 1;
          }
        });
        if (Count == 0) {
          const confirm = this.dialog.open(DeleteEmployeeComponent, {
            disableClose: true,
            data: { id }
          });
        }
        else {

          this.dataService.GetUser(id).subscribe(UserRecieved => {
            this.userDelete = UserRecieved
            this.UserToDelete.role_ID = this.userDelete.role_ID;
            this.UserToDelete.username = this.userDelete.username;
            this.UserToDelete.password = this.userDelete.password;
            this.UserToDelete.profile_Picture = this.userDelete.profile_Picture;
            this.UserToDelete.user_Id = this.userDelete.user_Id;
            this.UserToDelete.role = this.userDelete.role;
          });

          var action = "ERROR";
          var title = "ERROR: Category In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The role <strong>" + this.UserToDelete.username + " <strong style='color:red'>IS ASSOCIATED WITH A USER!</strong><br> Please remove the user from associated tables to continue with deletion.");

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
