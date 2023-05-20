import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';


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
  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]]
    })
  }

  onSubmit(): void {
    this.budgetCategory.account_Name = this.budgetCategoryForm.get('account_Name')?.value;
    this.budgetCategory.description = this.budgetCategoryForm.get('description')?.value;
    this.dataService.AddBudgetCategory(this.budgetCategory).subscribe(result => {
      this.router.navigate(['/ViewBudgetCategory']);
    });
    console.log(this.budgetCategory);
  }

  onCancel(): void {
    this.budgetCategoryForm.reset();
    this.router.navigate(['/ViewBudgetCategory']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetCategoryForm.controls[controlName].hasError(errorName);
  }
}
