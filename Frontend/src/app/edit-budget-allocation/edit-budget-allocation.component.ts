import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export const YEAR_ONLY_FORMAT = {
  parse: { dateInput: 'YYYY' },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

export class YearOnlyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    return date.getFullYear().toString();
  }
}



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-budget-allocation',
  templateUrl: './edit-budget-allocation.component.html',
  styleUrls: ['./edit-budget-allocation.component.css'],
  providers: [
    { provide: DateAdapter, useClass: YearOnlyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMAT },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ]
})
export class EditBudgetAllocationComponent {

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
    total: 0,
    department: this.dep
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  departments: any[] = []
  minDate:any;
  budgetAllocationForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    let currentYear = new Date().getFullYear()
    let currentmonth = new Date().getMonth();
    let currentDay = new Date().getDate();
     this.minDate = new Date(currentYear - 1, currentmonth, currentDay);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetAllocation(id);
    this.GetDepartments();
    this.budgetAllocationForm = this.formBuilder.group({
      department_ID: ['', [Validators.required]],
      date_Created: ['', [Validators.required]],
      year: [Date.now(), [Validators.required]],
      total: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]]
    })
  }

  onSubmit(): void {

    this.dep.department_ID = this.budgetAllocationForm.get('department_ID')?.value;
    console.log(this.dep.department_ID);
    this.budgetAllocation.department_ID = this.dep.department_ID;
    this.budgetAllocation.date_Created = this.budgetAllocationForm.get('date_Created')?.value;
    let date = this.budgetAllocationForm.get('year')?.value
    this.budgetAllocation.year = date.getFullYear();
    this.budgetAllocation.total = this.budgetAllocationForm.get('total')?.value;
    console.log(this.budgetAllocation);

    this.dataService.GetDepartment(this.budgetAllocationForm.get('department_ID')?.value).subscribe(r => {
      var dep: any = r;
      this.dataService.BudgetAllocationValidation(dep.name, this.budgetAllocation.year).subscribe(re => {
        if (re == null) {
          this.dataService.EditBudgetAllocation(this.budgetAllocation.budget_ID, this.budgetAllocation).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Allocation for: " + this.budgetAllocation.department.name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                var action = "Update";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for department: <strong>" + dep.name + "</strong> for year: " + this.budgetAllocation.year +" has been <strong style='color:green'> UPDATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/ViewBudgetAllocation']);
                  dialogRef.close();
                }, duration);
                
              }
            })
          });
        } else if (re.total == this.budgetAllocation.total && re.year == this.budgetAllocation.year && re.department.name == dep.name && re.budget_ID == Number(this.route.snapshot.paramMap.get('id'))) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to Budget Allocation for department: <strong>" + dep.name + "</strong> for year: <strong>" + this.budgetAllocation.year +"</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            this.router.navigate(['/ViewBudgetAllocation']);
            dialogRef.close();
          }, duration);
        }
        else if (re.total != this.budgetAllocation.total && re.year == this.budgetAllocation.year && re.department.name == dep.name && re.budget_ID == Number(this.route.snapshot.paramMap.get('id'))) {
          this.dataService.EditBudgetAllocation(this.budgetAllocation.budget_ID, this.budgetAllocation).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Allocation for: " + this.budgetAllocation.department.name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                var action = "Update";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Allocation for department: <strong>" + dep.name + "</strong> for year: " + this.budgetAllocation.year + " has been <strong style='color:green'> UPDATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/ViewBudgetAllocation']);
                  dialogRef.close();
                }, duration);

              }
            })
          });
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Budget Allocation Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("A Budget Allocation for department: <strong>" + dep.name + " for the year: <strong>" + this.budgetAllocation.year + " <strong style='color:red'> ALREADY EXISTS!</strong>");

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

    })

    /*this.dataService.BudgetAllocationValidation(this.)*/

    
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe((data: any[]) => {
      this.departments = data;
    })
  }

  GetBudgetAllocation(id: number) {
    this.dataService.GetBudgetAllocation(id).subscribe((data: any) => {
      this.budgetAllocation = data;

      console.log(this.budgetAllocation)
      this.budgetAllocationForm.patchValue({
        department_ID: this.budgetAllocation.department_ID,
        date_Created: this.budgetAllocation.date_Created,
        year: new Date(Number(this.budgetAllocation.year), 12, 0),
        total: this.budgetAllocation.total
      })
    })
  }

  onCancel(): void {
    this.budgetAllocationForm.reset();
    this.router.navigate(['/ViewBudgetAllocation']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetAllocationForm.controls[controlName].hasError(errorName);
  }

  public onsYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    //console.log(normalizedYear)
    this.budgetAllocationForm.get("year").setValue(new Date(normalizedYear, 12, 0));
    datepicker.close();
  }
  



  openEditBATab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
