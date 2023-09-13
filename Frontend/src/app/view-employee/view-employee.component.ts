import { Component, OnInit, ViewChild } from '@angular/core';
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
import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from '../Settings/restore-dialog/restore-dialog.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { Access } from '../Shared/Access';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { EmployeeIFrameComponent } from '../HelpIFrames/EmployeeIFrame/employee-iframe/employee-iframe.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { MatPaginator } from '@angular/material/paginator';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }, MainNavComponent]
})
export class ViewEmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'surname', 'username', 'email', 'phone', 'role', 'branch', 'department', 'mandate limit', 'action', 'delete', 'delegation'];
  dataSource: any;

  userDelete: any

  Access: Access = {
    Access_ID: 0,
    IsAdmin: '',
    CanAccInv: '',
    CanAccFin: '',
    CanAccPro: '',
    CanAccVen: '',
    CanAccRep: '',
    CanViewPenPro: '',
    CanViewFlagPro: '',
    CanViewFinPro: '',
    CanAppVen: '',
    CanEditVen: '',
    CanDeleteVen: '',
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: '',
  }

  UserToDelete: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
    role: this.rl
  }

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer, private nav: MainNavComponent) { }

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
    this.nav.reload();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();



    if (searchTerm) {
      this.dataSource = this.Employees.filter(r => r.employeeName.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.GetEmployees();
    }
  }

  GetEmployees() {
    this.dataService.GetEmployees().subscribe(result => {
      let employeeList: any[] = result;
      this.Employees = [...employeeList];
      this.SearchedEmployee = [...employeeList];
      this.dataSource = new MatTableDataSource(this.Employees.filter((value, index, self) => self.map(x => x.employeeID).indexOf(value.employeeID) == index));
      this.dataSource.paginator = this.paginator


      if (result) {
        hideloader();
      }
      //this.Employees = result;
      //this.SearchedEmployee = this.Employees;
    });
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
  }



  DeleteEmployee(userID: Number, empID: Number, username: string) {
    

    this.dataService.UserDeleteDelegationValidation(userID, username).subscribe({
      next: (dResult) => {
        if (dResult == null) {

          this.dataService.UserDeleteOnboardRequestValidation(userID).subscribe({
            next: (oResult) => {
              if (oResult == null) {

                this.dataService.UserDeleteProcurementRequestValidation(userID).subscribe({
                  next: (pResult) => {
                    if (pResult == null) {

                      this.dataService.EmployeeDeleteProcurementDetailsValidation(empID).subscribe({
                        next: (pdResult) => {
                          if (pdResult == null) {

                            const confirm = this.dialog.open(DeleteEmployeeComponent, {
                              disableClose: true,
                              data: { userID }
                            });

                            this.dialog.afterAllClosed.subscribe({
                              next: (response) => {
                                this.ngOnInit();
                              }
                            })
                          }
                          else {
                            this.dataService.GetUser(userID).subscribe(UserRecieved => {
                              this.userDelete = UserRecieved
                              this.UserToDelete.role_ID = this.userDelete.role_ID;
                              this.UserToDelete.username = this.userDelete.username;
                              this.UserToDelete.password = this.userDelete.password;
                              this.UserToDelete.profile_Picture = this.userDelete.profile_Picture;
                              this.UserToDelete.user_Id = this.userDelete.user_Id;
                              this.UserToDelete.role = this.userDelete.role;

                              var action = "ERROR";
                              var title = "ERROR: User In Use";
                              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + this.UserToDelete.username + " <strong style='color:red'>IS ASSOCIATED WITH A PROCUREMENT REQUEST!</strong><br> Please remove the user from associated tables to continue with deletion.");

                              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                                disableClose: true,
                                data: { action, title, message }
                              });

                              const duration = 4000;
                              setTimeout(() => {
                                dialogRef.close();
                              }, duration);
                            });
                          }
                        }
                      })
                    }
                    else {
                      this.dataService.GetUser(userID).subscribe(UserRecieved => {
                        this.userDelete = UserRecieved
                        this.UserToDelete.role_ID = this.userDelete.role_ID;
                        this.UserToDelete.username = this.userDelete.username;
                        this.UserToDelete.password = this.userDelete.password;
                        this.UserToDelete.profile_Picture = this.userDelete.profile_Picture;
                        this.UserToDelete.user_Id = this.userDelete.user_Id;
                        this.UserToDelete.role = this.userDelete.role;

                        var action = "ERROR";
                        var title = "ERROR: User In Use";
                        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + this.UserToDelete.username + " <strong style='color:red'>IS ASSOCIATED WITH A PROCUREMENT REQUEST!</strong><br> Please remove the user from associated tables to continue with deletion.");

                        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                          disableClose: true,
                          data: { action, title, message }
                        });

                        const duration = 4000;
                        setTimeout(() => {
                          dialogRef.close();
                        }, duration);
                      });
                    }
                  }
                })
              }
              else {
                this.dataService.GetUser(userID).subscribe(UserRecieved => {
                  this.userDelete = UserRecieved
                  this.UserToDelete.role_ID = this.userDelete.role_ID;
                  this.UserToDelete.username = this.userDelete.username;
                  this.UserToDelete.password = this.userDelete.password;
                  this.UserToDelete.profile_Picture = this.userDelete.profile_Picture;
                  this.UserToDelete.user_Id = this.userDelete.user_Id;
                  this.UserToDelete.role = this.userDelete.role;

                  var action = "ERROR";
                  var title = "ERROR: User In Use";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + this.UserToDelete.username + " <strong style='color:red'>IS ASSOCIATED WITH A ONBOARD REQUEST!</strong><br> Please remove the user from associated tables to continue with deletion.");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 4000;
                  setTimeout(() => {
                    dialogRef.close();
                  }, duration);
                });
              }
            }
          })
        }
        else {
          this.dataService.GetUser(userID).subscribe(UserRecieved => {
            this.userDelete = UserRecieved
            this.UserToDelete.role_ID = this.userDelete.role_ID;
            this.UserToDelete.username = this.userDelete.username;
            this.UserToDelete.password = this.userDelete.password;
            this.UserToDelete.profile_Picture = this.userDelete.profile_Picture;
            this.UserToDelete.user_Id = this.userDelete.user_Id;
            this.UserToDelete.role = this.userDelete.role;

            var action = "ERROR";
            var title = "ERROR: User In Use";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + this.UserToDelete.username + " <strong style='color:red'>IS ASSOCIATED WITH A DELEGATION REQUEST!</strong><br> Please remove the user from associated tables to continue with deletion.");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 4000;
            setTimeout(() => {
              dialogRef.close();
            }, duration);
          });
        }
      }
    })
  }


  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openRestoreDialog() {
    const dialogRef = this.dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  openEmployeeIFrameTab(): void {
    const dialogRef = this.dialog.open(EmployeeIFrameComponent, {
    //   width: '800px', // Set the desired width
    //  height: '600%', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
  
}
