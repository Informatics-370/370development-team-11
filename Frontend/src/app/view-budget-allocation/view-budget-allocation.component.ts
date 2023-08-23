import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { BudgetLine } from '../Shared/BudgetLine';
import { Department } from '../Shared/Department';
import { DeleteBudgetAllocationComponent } from '../delete-budget-allocation/delete-budget-allocation.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { BudgetAllocationIFrameComponent } from '../HelpIFrames/BudgetAllocationIFrame/budget-allocation-iframe/budget-allocation-iframe.component';
import { ExportBaPickerComponent } from '../export-ba-picker/export-ba-picker.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-budget-allocation',
  templateUrl: './view-budget-allocation.component.html',
  styleUrls: ['./view-budget-allocation.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewBudgetAllocationComponent {

  BudgetLines: BudgetLine[] = [];
  BudgetAllocations: BudgetAllocation[] = [];
  SearchedBudgetAllocations: BudgetAllocation[] = [];
  ExportBudgetLine: BudgetLine[] = [];

  searchNumber: Number = null;
  displayedColumns: string[] = ['department', 'date', 'year', 'total', 'lines', 'export', 'action', 'delete' ];
  dataSource = new MatTableDataSource<BudgetAllocation>();

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  deleteBudgetAllocation: BudgetAllocation = {
    budget_ID: 0,
    department_ID: 0,
    date_Created: '2023-05-07T12:14:46.249Z',
    year: 0,
    total: 0,
    department: this.dep
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  iRole: string;
  iDep: string;
  iCanViewFinPro: string = "false";
  canViewFinPro: string;

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,
    private sanitizer: DomSanitizer) { }

  OnInPutChange() {
    const Searchterm = this.searchNumber;

    if (Searchterm) {
      this.SearchedBudgetAllocations = this.BudgetAllocations.filter(budgetAllocation => budgetAllocation.year == Searchterm)
      console.log(this.SearchedBudgetAllocations)
      this.dataSource = new MatTableDataSource(this.SearchedBudgetAllocations);
    }
    else if (Searchterm == 0) {
      this.SearchedBudgetAllocations = [...this.BudgetAllocations];
      this.dataSource = new MatTableDataSource(this.SearchedBudgetAllocations);
    }

    this.dataSource = new MatTableDataSource<BudgetAllocation>(this.SearchedBudgetAllocations);
  }

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iDep = this.dataService.decodeUserDep(sessionStorage.getItem("token"));
    this.iCanViewFinPro = this.dataService.decodeCanViewFinPro(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.canViewFinPro = "true";
      this.GetBudgetAllocations();
    } else if (this.iCanViewFinPro == "true") {
      this.canViewFinPro = "true";
      this.GetDepBudgetAllocation();
    } else {
      this.GetDepBudgetAllocation();
    }

    
  }

  GetBudgetAllocations() {
    this.dataService.GetBudgetAllocations().subscribe(result => {
      this.BudgetAllocations = result;
      this.dataSource = new MatTableDataSource(this.BudgetAllocations);
    });
  }

  GetDepBudgetAllocation() {
    this.dataService.GetDepBudgetAllocation(this.iDep).subscribe(r => {
      this.BudgetAllocations = r;
      this.dataSource = new MatTableDataSource(this.BudgetAllocations);
    })
  }

  exportExcel(id: Number, name: String) {

    this.dataService.BudgetAllocationExportValidation(id).subscribe(r => {
      console.log(r);
      if (r != null) {
        const confirm = this.dialog.open(ExportBaPickerComponent, {
          disableClose: true,
          data: { id, name }
        });

        this.dialog.afterAllClosed.subscribe({
          next: (response) => {
            this.ngOnInit();
          }
        })
      } else {
        var action = "ERROR";
        var title = "ERROR: No Budget Line exists";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Budget Lines exists for the Budget Allocation <strong>" + name + "<strong>!</strong>");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      }
    })

    

    

  }

  DeleteBudgetAllocation(id: Number) {
    this.dataService.GetBudgetLines().subscribe({
      next: (result) => {
        let LineList: any[] = result
        LineList.forEach((element) => {
          this.BudgetLines.push(element)
        });
        console.log(this.BudgetLines)
        var Count: number = 0;
        this.BudgetLines.forEach(element => {
          if (element.budget_ID == id) {
            Count = Count + 1;
            console.log(Count)
          }
        });

        if (Count == 0) {
          const confirm = this.dialog.open(DeleteBudgetAllocationComponent, {
            disableClose: true,
            data: { id }
          });
        }
        else {

          this.dataService.GetBudgetAllocation(id).subscribe({
            next: (allocationReceived) => {
              this.deleteBudgetAllocation = allocationReceived as BudgetAllocation;
            }
          })
          var action = "ERROR";
          var title = "ERROR: Budget Allocation In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for year <strong> " + this.deleteBudgetAllocation.year + " <strong style='color:red'>IS ASSOCIATED WITH A BUDGET LINE!</strong><br> Please remove the budget allocation from the budget line to continue with deletion.");

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


  openBudgetAllocationIFrameTab(): void {
    const dialogRef = this.dialog.open(BudgetAllocationIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
