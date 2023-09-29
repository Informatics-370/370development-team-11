import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEmployeeRoleComponent } from '../delete-employee-role/delete-employee-role.component';
import { Role } from '../Shared/EmployeeRole';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../DataService/data-service';
import { User } from '../Shared/User';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from '../Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from '../Settings/restore-dialog/restore-dialog.component';
import { RoleIFrameComponent } from '../HelpIFrames/RoleIFrame/role-iframe/role-iframe.component';
import { TimerComponent } from '../Settings/timer/timer.component';
import { CreateVatComponent } from '../Settings/create-vat/create-vat.component';
import { EditVatComponent } from '../Settings/edit-vat/edit-vat.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-employee-role',
  templateUrl: './view-employee-role.component.html',
  styleUrls: ['./view-employee-role.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewEmployeeRoleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['name', 'description', 'action', 'delete'];
  roleDelete: any;
  RoleToUse: string = "";

  RoleToDelete: Role = {
    role_ID: 0,
    name: '',
    description: '',
  }

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer) { }

  Users: User[] = [];
  Roles: Role[] = [];
  SearchedRole: Role[] = [];
  searchWord: string = "";

  iRole: string;
  rAdmin: string;

  ngOnInit() {

    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetRoles();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();


    if (searchTerm) {
      this.SearchedRole = this.Roles.filter(r => r.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.GetRoles();
    }
  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      let employeeList: any[] = result;
      this.Roles = [...employeeList];
      this.SearchedRole = [...employeeList];
      this.dataSource = new MatTableDataSource(this.Roles.filter((value, index, self) => self.map(x => x.role_ID).indexOf(value.role_ID) == index));
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



  DeleteEmpRole(id: Number) {
    this.dataService.RoleDeleteUserValidation(id).subscribe(r => {
      if (r == null) {
        const confirm = this.dialog.open(DeleteEmployeeRoleComponent, {
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
        this.dataService.GetRole(id).subscribe(RoleRecieved => {
          this.roleDelete = RoleRecieved
          this.RoleToDelete.role_ID = this.roleDelete.role_ID;
          this.RoleToDelete.name = this.roleDelete.name;
          this.RoleToDelete.description = this.roleDelete.description;

          var action = "ERROR";
          var title = "ERROR: Role In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The role <strong>" + this.roleDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH A USER!</strong><br> Please remove the role from the user to continue with deletion.");

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
  openTimerDialog() {
    const dialogRef = this.dialog.open(TimerComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreateVATDialog() {
    const dialogRef = this.dialog.open(CreateVatComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditVATDialog() {
    const dialogRef = this.dialog.open(EditVatComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openRoleIFrameTab(): void {
    const dialogRef = this.dialog.open(RoleIFrameComponent, {
      //   width: '800px', // Set the desired width
      //  height: '600%', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }

}
