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
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from '../Settings/backupDialog/restore.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewEmployeeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'username', 'email', 'phone', 'role', 'branch', 'department', 'mandate limit', 'action', 'delete', 'delegation'];
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
    no_Notifications: 0,
    role: this.rl
  }

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer) { }

  DeleteEmployees: Employee[] = [];
  Employees: Employee[] = [];
  SearchedEmployee: Employee[] = [];
  Users: User[] = [];
  OnboardRequests: OnboardRequest[] = [];
  searchWord: string = "";

  ngOnInit() {
    this.RoleToUse = this.dataService.decodeUserRole(sessionStorage.getItem("token"))

    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.GetEmployees();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
    


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
      console.log(result)
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

          this.dialog.afterAllClosed.subscribe({
            next: (response) => {
              this.ngOnInit();
            }
          })
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
          var title = "ERROR: Role In Use";
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


  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
