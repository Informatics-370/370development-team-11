import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';


@Component({
  selector: 'app-create-budget-category',
  templateUrl: './create-budget-category.component.html',
  styleUrls: ['./create-budget-category.component.css']
})
export class CreateBudgetCategoryComponent {
  budgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  budgetCategoryForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 -&:]+$")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9 -&:]+$")]]
    })
  }

  onSubmit(): void {
    this.budgetCategory.account_Name = this.budgetCategoryForm.get('account_Name')?.value;
    this.budgetCategory.description = this.budgetCategoryForm.get('description')?.value;
    this.dataService.BudgetCategoryValidation(this.budgetCategory.account_Name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddBudgetCategory(this.budgetCategory).subscribe(
            (CategoryAdded) => {

              if (CategoryAdded) {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");
              }

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
}
