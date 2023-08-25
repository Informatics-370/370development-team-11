import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-create-budget-category',
  templateUrl: './create-budget-category.component.html',
  styleUrls: ['./create-budget-category.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateBudgetCategoryComponent {
  budgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Code: "",
    account_Name: '',
    description: ''
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  budgetCategoryForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]],
      account_Code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(9), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 .,]+")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]]
    })
  }

  onSubmit(): void {
    this.budgetCategory.account_Name = this.budgetCategoryForm.get('account_Name')?.value;
    this.budgetCategory.account_Code = this.budgetCategoryForm.get('account_Code')?.value;
    this.budgetCategory.description = this.budgetCategoryForm.get('description')?.value;
    console.log(this.budgetCategory)
    this.dataService.BudgetCategoryValidation(this.budgetCategory.account_Name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddBudgetCategory(this.budgetCategory).subscribe(
            (CategoryAdded) => {

              if (CategoryAdded) {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
              }

              this.log.action = "Created Budget Category: " + this.budgetCategory.account_Name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "CREATE";
                  var title = "CREATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The budget category <strong>" + this.budgetCategory.account_Name + "</strong> has been <strong style='color:green'> ADDED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewBudgetCategory']);
                    dialogRef.close();
                  }, duration);
                }
              })


            }
          );
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Budget Category Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.budgetCategory.account_Name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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



  onCancel(): void {
    this.budgetCategoryForm.reset();
    this.router.navigate(['/ViewBudgetCategory']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetCategoryForm.controls[controlName].hasError(errorName);
  }


  openCreateBCTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf';
    window.open(userManualUrl, '_blank');
  }
}
