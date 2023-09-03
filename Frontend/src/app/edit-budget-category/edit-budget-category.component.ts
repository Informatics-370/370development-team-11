import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



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
  selector: 'app-edit-budget-category',
  templateUrl: './edit-budget-category.component.html',
  styleUrls: ['./edit-budget-category.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditBudgetCategoryComponent {

  currentBudgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Code: '',
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
  currentName: String = "";
  currentDescription: String = "";
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetCategory(id);
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]],
      account_Code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(9), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 .,]+")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]]
    })

  }

  GetBudgetCategory(id: number) {
    this.dataService.GetBudgetCategory(id).subscribe({
      next: (BudgetCategory: BudgetCategory) => {
        this.currentBudgetCategory = BudgetCategory;
        this.currentName = this.currentBudgetCategory.account_Name;
        this.currentDescription = this.currentBudgetCategory.description;
      }
    });
  }

  onSubmit(): void {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.currentBudgetCategory.account_Name = this.budgetCategoryForm.get('account_Name')?.value;
    this.currentBudgetCategory.account_Code = this.budgetCategoryForm.get('account_Code')?.value;
    this.currentBudgetCategory.description = this.budgetCategoryForm.get('description')?.value;

    this.dataService.BudgetCategoryValidation(this.currentBudgetCategory.account_Name).subscribe(r => {
      if (r == null) {
        this.dataService.EditBudgetCategory(this.currentBudgetCategory.category_ID, this.currentBudgetCategory).subscribe(result => {
          document.getElementById('AnimationBtn').classList.toggle("is_active");
          document.getElementById('cBtn').style.display = "none";

          this.log.action = "Edited Budget Category for: " + this.currentBudgetCategory.account_Name;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Category <strong>" + this.currentBudgetCategory.account_Name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
        });
      } else if (r.account_Name == this.currentBudgetCategory.account_Name && r.category_ID == Number(this.route.snapshot.paramMap.get('id')) && r.description == this.currentBudgetCategory.description && r.account_Code == this.currentBudgetCategory.account_Code) {
        var action = "NOTIFICATION";
        var title = "NOTIFICATION: NO CHANGES MADE";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to Budget Category: <strong>" + this.currentBudgetCategory.account_Name + "</strong>");

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
      else if (r.account_Name == this.currentBudgetCategory.account_Name && r.category_ID == Number(this.route.snapshot.paramMap.get('id')) && r.description != this.currentBudgetCategory.description || r.account_Code != this.currentBudgetCategory.account_Code) {
        this.dataService.EditBudgetCategory(this.currentBudgetCategory.category_ID, this.currentBudgetCategory).subscribe(result => {
          document.getElementById('AnimationBtn').classList.toggle("is_active");
          document.getElementById('cBtn').style.display = "none";

          this.log.action = "Edited Budget Category for: " + this.currentBudgetCategory.account_Name;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Category <strong>" + this.currentBudgetCategory.account_Name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
        });
      }
      else {
        var action = "ERROR";
        var title = "ERROR: Budget Category Exists";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Category <strong>" + this.currentBudgetCategory.account_Name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  onCancel(): void {
    this.router.navigate(['/ViewBudgetCategory']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetCategoryForm.controls[controlName].hasError(errorName);
  }




  openEditBCTab(): void {
    const userManualUrl = 'assets/PDF/EditCategoryUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
