import { Component, OnInit, ViewChild } from '@angular/core';
import { Department } from 'src/app/Shared/Department';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteDepartmentComponent } from 'src/app/delete-department/delete-department/delete-department.component';
import { DataService } from 'src/app/DataService/data-service';
import { Employee } from 'src/app/Shared/Employee';
import { BudgetAllocation } from 'src/app/Shared/BudgetAllocation';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { count, elementAt } from 'rxjs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from 'src/app/Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from 'src/app/Settings/restore-dialog/restore-dialog.component';
import { DepartmentIFrameComponent } from 'src/app/HelpIFrames/DepartmentIFrame/department-iframe/department-iframe.component';
import { MatPaginator } from '@angular/material/paginator';
import { TimerComponent } from 'src/app/Settings/timer/timer.component';
import { CreateVatComponent } from '../../Settings/create-vat/create-vat.component';
import { EditVatComponent } from '../../Settings/edit-vat/edit-vat.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewDepartmentComponent implements OnInit {
  Departments: Department[] = [];
  Employees: Employee[] = [];
  Budget_Allocation: BudgetAllocation[] = [];
  SearchedDepartment: Department[] = [];
  searchWord: string = "";

  DepartmentToDelete: any = {
    department_ID: 0,
    name: '',
    description: '',
  }

  displayedColumns: string[] = ['name', 'description', 'action', 'delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
    this.GetDepartments();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();

    if (searchTerm) {
      this.dataSource = this.Departments.filter(department => department.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.GetDepartments();
    }
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe(result => {
      let employeeList: any[] = result;
      this.Departments = [...employeeList];
      this.SearchedDepartment = [...employeeList];
      this.dataSource = new MatTableDataSource(this.Departments.filter((value, index, self) => self.map(x => x.department_ID).indexOf(value.department_ID) == index));
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
  GetEmployees() {
    this.dataService.GetEmployees().subscribe(result => {
      this.Employees = result;
    })
  }


  DeleteDepartment(department_ID: number) {
    this.dataService.DepartmentDeleteUserValidation(department_ID).subscribe(u => {
      if (u == null) {
        this.dataService.DepartmentDeleteBudgetAllocationValidation(department_ID).subscribe(ba => {
          if (ba == null) {
            const confirm = this.Dialog.open(DeleteDepartmentComponent, {
              disableClose: true,
              data: { department_ID }
            });

            this.dialog.afterAllClosed.subscribe({
              next: (response) => {
                this.ngOnInit();
              }
            })
          }
          else {
            this.dataService.GetDepartment(department_ID).subscribe({
              next: (DepartmentRecieved) => {
                this.DepartmentToDelete = DepartmentRecieved
                var action = "ERROR";
                var title = "ERROR: Department In Use";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + this.DepartmentToDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH BUDGET ALLOCATION!</strong><br> Please remove the Department from the Budget allocation to continue with deletion.");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 4000;
                setTimeout(() => {
                  dialogRef.close();
                }, duration);
              }
            })
          }
        })
      }
      else {
        this.dataService.GetDepartment(department_ID).subscribe({
          next: (DepartmentRecieved) => {
            this.DepartmentToDelete = DepartmentRecieved
          }
        })
        var action = "ERROR";
        var title = "ERROR: Department In Use";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + this.DepartmentToDelete.name + " <strong style='color:red'>IS ASSOCIATED WITH AN EMPLOYEE!</strong><br> Please remove the Department from the Employee to continue with deletion.");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 4000;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
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
    this.dataService.GetVAT().subscribe(re => {
      if (re == null) {
        var action = "ERROR";
        var title = "ERROR: VAT does not Exists";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No VAT <strong style='color:red'>EXISTS ON THE SYSTEM!</strong><br> Please add one before and try again.");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 4000;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      } else {
        const dialogRef = this.dialog.open(EditVatComponent);

        dialogRef.afterClosed().subscribe(result => {
        });
      }
    })
  }

  openDepartmentIFrameTab(): void {
    const dialogRef = this.dialog.open(DepartmentIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }


}
