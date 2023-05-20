import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetCategory } from '../Shared/BudgetCategory';

@Component({
  selector: 'app-edit-budget-category',
  templateUrl: './edit-budget-category.component.html',
  styleUrls: ['./edit-budget-category.component.css']
})
export class EditBudgetCategoryComponent {

  currentBudgetCategory: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  budgetCategoryForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetCategory(id);
    this.budgetCategoryForm = this.formBuilder.group({
      account_Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]]
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
      this.router.navigate(['/ViewBudgetCategory']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/ViewBudgetCategory']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetCategoryForm.controls[controlName].hasError(errorName);
  }

}
