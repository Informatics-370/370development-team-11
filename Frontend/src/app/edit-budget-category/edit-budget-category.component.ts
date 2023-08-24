import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
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
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetCategory(id);
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 &:-]+")]]
    })

  }

  GetBudgetCategory(id: number) {
    this.dataService.GetBudgetCategory(id).subscribe({
      next: (BudgetCategory: BudgetCategory) => {
        this.currentBudgetCategory = BudgetCategory;
      }
    });
  }

  onSubmit(): void {
    this.currentBudgetCategory.account_Name = this.budgetCategoryForm.get('account_Name')?.value;
    this.currentBudgetCategory.description = this.budgetCategoryForm.get('description')?.value;
    console.log(this.currentBudgetCategory)
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
          this.router.navigate(['/ViewBudgetCategory']);
        }
      })
    });
  }

  onCancel(): void {
    this.router.navigate(['/ViewBudgetCategory']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetCategoryForm.controls[controlName].hasError(errorName);
  }




  openEditBCTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
