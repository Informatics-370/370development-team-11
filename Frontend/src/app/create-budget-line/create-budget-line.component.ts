import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';

@Component({
  selector: 'app-create-budget-line',
  templateUrl: './create-budget-line.component.html',
  styleUrls: ['./create-budget-line.component.css']
})
export class CreateBudgetLineComponent {
  id: Number;

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  category: BudgetCategory = {
    category_ID: 0,
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
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
    account_Code: 0,
    budget_Category: this.category,
    month: '2023-05-07',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  categories: any[] = []
  budgetLineForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id = id;
    this.GetCategories();
    this.budgetLineForm = this.formBuilder.group({
      category_ID: ['', [Validators.required]],
      account_Code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
      month: ['', [Validators.required]],
      budgetAmt: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
      actualAmt: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
      variance: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]]
    })
  }

  onSubmit(): void {
    this.category = this.budgetLineForm.get('category_ID')?.value;
    this.budgetLine.budget_Category = this.category;
    this.budgetLine.account_Code = this.budgetLineForm.get('account_Code')?.value;
    this.budgetLine.month = this.budgetLineForm.get('month')?.value;
    this.budgetLine.budgetAmt = this.budgetLineForm.get('budgetAmt')?.value;
    this.budgetLine.actualAmt = this.budgetLineForm.get('actualAmt')?.value;
    this.budgetLine.variance = this.budgetLineForm.get('variance')?.value;
    this.budgetLine.budget_Allocation.budget_ID = this.id;
    this.budgetLine.budget_Allocation.department_ID = 0;
    console.log(this.budgetLine);

    this.dataService.AddBudgetLine(this.budgetLine).subscribe(result => {
      this.router.navigate(['/ViewBudgetLines', this.id]);
    });
  }

  GetCategories() {
    this.dataService.GetBudgetCategories().subscribe((data: any[]) => {
      this.categories = data;
    })
  }

  onCancel(): void {
    this.budgetLineForm.reset();
    this.router.navigate(['/ViewBudgetLines', this.id]);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetLineForm.controls[controlName].hasError(errorName);
  }


}