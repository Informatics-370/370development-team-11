import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';
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
  selector: 'app-edit-budget-line',
  templateUrl: './edit-budget-line.component.html',
  styleUrls: ['./edit-budget-line.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditBudgetLineComponent {

  id: Number;
  id2: String;

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  category: BudgetCategory = {
    category_ID: 0,
    account_Code: '',
    account_Name: '',
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


  budgetLine: BudgetLine = {
    budgetLineId: 0,
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
    budget_Category: this.category,
    month: '2023-05-07',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  categories: BudgetCategory[] = []
  budgetLineForm: FormGroup = new FormGroup({});
  CatInUse: String;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const id2 = String(this.route.snapshot.paramMap.get('id2'));
    console.log(id2);
    this.id = id;
    this.id2 = id2;
    this.GetCategories();
    this.budgetLineForm = this.formBuilder.group({
      category_ID: ['', [Validators.required]],
      month: ['', [Validators.required]],
      budgetAmt: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
      actualAmt: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
    });
    this.GetBudgetLineByID();


  }

  GetBudgetLineByID() {
    this.dataService.GetBudgetLine(this.id2).subscribe((data: any) => {
      this.budgetLine = data;
      console.log(this.budgetLine)
      this.CatInUse = this.budgetLine.budget_Category.account_Name;

      this.budgetLineForm.patchValue({
        category_ID: this.budgetLine.category_ID,
        account_Code: this.budgetLine.budget_Category.account_Code,
        month: this.budgetLine.month,
        budgetAmt: this.budgetLine.budgetAmt,
        actualAmt: this.budgetLine.actualAmt
      })

      //const CategoryID = Number(this.budgetLine.budget_Category.category_ID);
      //const CategoryIndex = this.categories.findIndex((category) => category.category_ID == CategoryID);
      //this.budgetLineForm.get('category_ID')?.setValue(this.categories[CategoryIndex].account_Name);

    });
  }

  GetCategories() {
    this.dataService.GetBudgetCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories)

    });
  }

  onSubmit() {
    this.budgetLine.category_ID = this.budgetLineForm.get('category_ID')?.value;
    this.budgetLine.month = this.budgetLineForm.get('month')?.value;
    this.budgetLine.budgetAmt = this.budgetLineForm.get('budgetAmt')?.value;
    this.budgetLine.actualAmt = this.budgetLineForm.get('actualAmt')?.value;
    this.budgetLine.variance = Number(this.budgetLine.budgetAmt) - Number(this.budgetLine.actualAmt);

    this.dataService.GetBudgetCategory(this.budgetLine.category_ID).subscribe(re => {
      var cat: any = re;
      console.log(this.budgetLine.budget_Category.account_Code)
      console.log(cat)

      this.dataService.BudgetLineValidation(cat.account_Code.toString(), cat.account_Name, this.budgetLine.month, Number(this.route.snapshot.paramMap.get('id'))).subscribe(r => {
        console.log(r)
        if (r == null) {

          this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Line for: " + this.budgetLine.budget_Category.account_Name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                var action = "Update";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Line: <strong>" + cat.account_Name + "</strong> for month: " + this.budgetLine.month + " has been <strong style='color:green'> UPDATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/ViewBudgetLines', this.id]);
                  dialogRef.close();
                }, duration);

              }
            })
          });
        }
        else if (r.category_ID == this.budgetLine.category_ID && r.budget_Category.account_Code == this.budgetLine.budget_Category.account_Code && r.month == this.budgetLine.month && r.budgetAmt == this.budgetLine.budgetAmt &&
          r.actualAmt == this.budgetLine.actualAmt && r.budgetLineId == Number(this.route.snapshot.paramMap.get('id'))) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to Budget Line: <strong>" + cat.account_Name + "</strong> for month: <strong>" + this.budgetLine.month + "</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            this.router.navigate(['/ViewBudgetLines', this.id]);
            dialogRef.close();
          }, duration);
        }
        else if (r.category_ID == this.budgetLine.category_ID && r.budget_Category.account_Code == this.budgetLine.budget_Category.account_Code && r.month == this.budgetLine.month && r.budgetAmt != this.budgetLine.budgetAmt &&
          r.actualAmt == this.budgetLine.actualAmt && r.budgetLineId == Number(this.route.snapshot.paramMap.get('id'))) {
          this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Line for: " + this.budgetLine.budget_Category.account_Name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Line: <strong>" + cat.account_Name + "</strong> for month: " + this.budgetLine.month + " has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewBudgetLines', this.id]);
                    dialogRef.close();
                  }, duration);

                }
              }
            })
          });
        }
        else if (r.category_ID == this.budgetLine.category_ID && r.budget_Category.account_Code == this.budgetLine.budget_Category.account_Code && r.month == this.budgetLine.month && r.budgetAmt == this.budgetLine.budgetAmt &&
          r.actualAmt != this.budgetLine.actualAmt && r.budgetLineId == Number(this.route.snapshot.paramMap.get('id'))) {
          this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Line for: " + this.budgetLine.budget_Category.account_Name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Line: <strong>" + cat.account_Name + "</strong> for month: " + this.budgetLine.month + " has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewBudgetLines', this.id]);
                    dialogRef.close();
                  }, duration);

                }
              }
            })
          });
        }

        else if (r.category_ID == this.budgetLine.category_ID && r.budget_Category.account_Code == this.budgetLine.budget_Category.account_Code && r.month == this.budgetLine.month && r.budgetAmt != this.budgetLine.budgetAmt &&
          r.actualAmt == this.budgetLine.actualAmt && r.budgetLineId == Number(this.route.snapshot.paramMap.get('id'))) {
          this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";

            this.log.action = "Edited Budget Line for: " + this.budgetLine.budget_Category.account_Name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Budget Line: <strong>" + cat.account_Name + "</strong> for month: " + this.budgetLine.month + " has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewBudgetLines', this.id]);
                    dialogRef.close();
                  }, duration);

                }
              }
            })
          });
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Budget Line Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("A Budget Line for: <strong>" + cat.account_Name + " for the month: <strong>" + this.budgetLine.month + " <strong style='color:red'> ALREADY EXISTS!</strong>");

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
  }

  onCancel() {
    this.router.navigate(['/ViewBudgetLines', this.id]);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetLineForm.controls[controlName].hasError(errorName);
  }



  openEditBLTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf';
    window.open(userManualUrl, '_blank');
  }
}
