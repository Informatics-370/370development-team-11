import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { Admin } from '../Shared/Admin';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';

import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from '../Settings/restore-dialog/restore-dialog.component';
import { Access } from '../Shared/Access';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { AdminIFrameComponent } from '../HelpIFrames/AdminIFrame/admin-iframe/admin-iframe.component';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-admin',
  templateUrl: './view-admin.component.html',
  styleUrls: ['./view-admin.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewAdminComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'email', 'phone', 'role', 'action', 'delete'];
  dataSource = new MatTableDataSource<Admin>();

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
    role: this.rl
  }

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer) { }

  Admins: Admin[] = [];
  SearchedAdmin: Admin[] = [];
  searchWord: string = "";

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetAdmins();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
    console.log(searchTerm);
    console.log(this.Admins)


    if (searchTerm) {
      this.SearchedAdmin = this.Admins.filter(r => r.adminName.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedAdmin = [...this.Admins]
    }
  }

  GetAdmins() {
    this.dataService.GetAdmins().subscribe(result => {
      if (result) {
        hideloader();
      }
      this.Admins = result;
      this.SearchedAdmin = this.Admins;
    });
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
  }

  DeleteAdmin(userID: Number, adminID: Number, username: string) {
    

    this.dataService.UserDeleteDelegationValidation(userID, username).subscribe({
      next: (dResult) => {
        if (dResult == null) {

          this.dataService.UserDeleteOnboardRequestValidation(userID).subscribe({
            next: (oResult) => {
              if (oResult == null) {

                this.dataService.UserDeleteProcurementRequestValidation(userID).subscribe({
                  next: (pResult) => {
                    if (pResult == null) {

                      this.dataService.AdminDeleteDelegationValidation(adminID).subscribe({
                        next: (adResult) => {
                          if (adResult == null) {

                            const confirm = this.dialog.open(DeleteAdminComponent, {
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
                            });

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
                      });

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
                });

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
          });

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

  openAdminIFrameTab(): void {
    const dialogRef = this.dialog.open(AdminIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
