import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';

@Component({
  selector: 'app-edit-budget-line',
  templateUrl: './edit-budget-line.component.html',
  styleUrls: ['./edit-budget-line.component.css']
})
export class EditBudgetLineComponent {

  id: Number;
  id2: Number;

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
  categories: BudgetCategory[] = []
  budgetLineForm: FormGroup = new FormGroup({});
  CatInUse: String;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const id2 = Number(this.route.snapshot.paramMap.get('id2'));
    console.log(id2);
    this.id = id;
    this.id2 = id2;
    this.GetCategories();
    this.budgetLineForm = this.formBuilder.group({
      category_ID: ['', [Validators.required]],
      account_Code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]],
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

      const CategoryID = Number(this.budgetLine.budget_Category.category_ID);
      console.log(CategoryID)
      const CategoryIndex = this.categories.findIndex((category) => category.category_ID == CategoryID);
      console.log(CategoryIndex)

      this.budgetLineForm.get('category_ID')?.setValue(this.categories[CategoryIndex].account_Name);
      console.log(this.budgetLineForm.get('category_ID')?.value)

    });
  }

  GetCategories() {
    this.dataService.GetBudgetCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories)

    });
  }

  onSubmit() {
    this.category = this.budgetLineForm.get('category_ID')?.value;
    this.budgetLine.budget_Category = this.category;
    this.budgetLine.account_Code = this.budgetLineForm.get('account_Code')?.value;
    this.budgetLine.month = this.budgetLineForm.get('month')?.value;
    this.budgetLine.budgetAmt = this.budgetLineForm.get('budgetAmt')?.value;
    this.budgetLine.actualAmt = this.budgetLineForm.get('actualAmt')?.value;
    this.budgetLine.variance = Number(this.budgetLine.budgetAmt) - Number(this.budgetLine.actualAmt);
    this.budgetLine.budget_Allocation.budget_ID = this.id;
    this.budgetLine.budget_Allocation.department_ID = 0;
    console.log(this.budgetLine);

    this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
      document.getElementById('cBtn').style.display = "none";
      document.querySelector('button').classList.toggle("is_active");
      this.router.navigate(['/ViewBudgetLines', this.id]);
    });
  }

  onCancel() {
    this.router.navigate(['/ViewBudgetLines', this.id]);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetLineForm.controls[controlName].hasError(errorName);
  }
}
