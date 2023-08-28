import { Component, Input, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuditLog } from '../Shared/AuditLog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Moment } from 'moment';
//import * as moment from 'moment';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';

const moment = _rollupMoment || _moment;





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
export class YearOnlyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    return date.getFullYear().toString();
  }
}

export const YEAR_ONLY_FORMAT = {
  parse: { dateInput: 'YYYY' },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-create-budget-allocation',
  templateUrl: './create-budget-allocation.component.html',
  styleUrls: ['./create-budget-allocation.component.css'],
  providers: [
    { provide: DateAdapter, useClass: YearOnlyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMAT },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ]
 
})

export class CreateBudgetAllocationComponent {

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  budgetAllocation: BudgetAllocation = {
    budget_ID: 0,
    department_ID: 0,
    date_Created: '2023-05-07T12:14:46.249Z',
    year: 0,
    total: null,
    department: this.dep
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  @ViewChild('dp1') dp1: MatDatepicker<Date>;
  minDate:any;
  
    
  departments: any[] = []

  budgetAllocationForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   let currentYear = new Date().getFullYear()
   let currentmonth = new Date().getMonth();
   let currentDay = new Date().getDate();
    this.minDate = new Date(currentYear - 1, currentmonth, currentDay);
    this.GetDepartments();
    this.budgetAllocationForm = this.formBuilder.group({
      department_ID: ['', [Validators.required]],
      // date_Created: ['', [Validators.required]],
      year: [Date.now(), [Validators.required]],
      total: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]]
    })
  }

  onSubmit(): void {
    this.dep = this.budgetAllocationForm.get('department_ID')?.value;
    this.dep.department_ID = 0;
    this.budgetAllocation.department = this.dep;
    this.budgetAllocation.date_Created = new Date().toISOString();
    let date = this.budgetAllocationForm.get('year')?.value
    this.budgetAllocation.year = date.getFullYear();
    this.budgetAllocation.total = this.budgetAllocationForm.get('total')?.value;
    console.log(this.budgetAllocation.department.name)
    this.dataService.BudgetAllocationValidation(this.budgetAllocation.department.name, this.budgetAllocation.year).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddBudgetAllocation(this.budgetAllocation).subscribe(
            (AllocationAdded) => {

              if (AllocationAdded) {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
              }

              this.log.action = "Created Budget Allocation for: " + this.budgetAllocation.department.name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "CREATE";
                  var title = "CREATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for department <strong>" + this.budgetAllocation.department.name + " </strong> For year <strong>" + this.budgetAllocation.year + " <strong style='color:green'> ADDED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewBudgetLines/' + AllocationAdded[0].budget_ID]);
                    dialogRef.close();
                  }, duration);
                }
              })


            }
          );
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Budget Allocation Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for department <strong>" + this.budgetAllocation.department.name + " </strong> For year <strong>" + this.budgetAllocation.year + " <strong style='color:red'>ALREADY EXISTS!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe((data: any[]) => {
      this.departments = data;
    })
  }

  onCancel(): void {
    this.budgetAllocationForm.reset();
    this.router.navigate(['/ViewBudgetAllocation']);
  }
 
  onYearSelected(event: any) {
    // Set only the year to the form control
    this.budgetAllocationForm.get('year').setValue(event.getFullYear());

    // Close the datepicker
    this.dp1.close();
  }

  displayYearOnly(date: Date | null): string {
    return date ? date.getFullYear().toString() : '';
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetAllocationForm.controls[controlName].hasError(errorName);
  }

  public onsYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    //console.log(normalizedYear)
    this.budgetAllocationForm.get("year").setValue(new Date(normalizedYear, 12, 0));
    //console.log(this.budgetAllocationForm.get("year").value())
    datepicker.close();
  }



  openCreateBATab(): void {
    const userManualUrl = 'assets/PDF/CreateAllocationUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
