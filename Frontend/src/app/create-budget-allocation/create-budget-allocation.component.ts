import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-create-budget-allocation',
  templateUrl: './create-budget-allocation.component.html',
  styleUrls: ['./create-budget-allocation.component.css']
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
    total: 0,
    department: this.dep
  }

  currentDate = Date.now();
  departments: any[] = []

  budgetAllocationForm: FormGroup = new FormGroup({});


  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.GetDepartments();
    this.budgetAllocationForm = this.formBuilder.group({
      department_ID: ['', [Validators.required]],
      // date_Created: ['', [Validators.required]],
      year: [0, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]+$")]],
      total: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]]
    })
  }

  onSubmit(): void {
    this.dep = this.budgetAllocationForm.get('department_ID')?.value;
    this.dep.department_ID = 0;
    this.budgetAllocation.department = this.dep;
    this.budgetAllocation.date_Created = new Date().toISOString();
    this.budgetAllocation.year = this.budgetAllocationForm.get('year')?.value;
    this.budgetAllocation.total = this.budgetAllocationForm.get('total')?.value;
    console.log(this.budgetAllocation.department.name)
    this.dataService.BudgetAllocationValidation(this.budgetAllocation.department.name, this.budgetAllocation.year).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddBudgetAllocation(this.budgetAllocation).subscribe(
            (AllocationAdded) => {

              if (AllocationAdded) {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");
              }

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
  monthSelectedHandler(event, datepicker: MatDatepicker<number>) {
    const date = new Date(`${event._i.month + 1}/${event._i.date}/${event._i.year}`);
    datepicker.close();
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetAllocationForm.controls[controlName].hasError(errorName);
  }
}
