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
    account_Code: '',
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
  Months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  categories: BudgetCategory[] = []
  budgetLineForm: FormGroup = new FormGroup({});
  CatInUse: String;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const id2 = String(this.route.snapshot.paramMap.get('id2'));
    console.log(id2);
    this.id = id;
    this.id2 = id2;
    this.GetCategories();
    this.budgetLineForm = this.formBuilder.group({
      category_ID: ['', [Validators.required]],
      account_Code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern("^[0-9 ,]+$")]],
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

      this.budgetLineForm.patchValue({
        category_ID: this.budgetLine.category_ID,
        account_Code: this.budgetLine.account_Code,
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
    this.budgetLine.account_Code = this.budgetLineForm.get('account_Code')?.value;
    this.budgetLine.month = this.budgetLineForm.get('month')?.value;
    this.budgetLine.budgetAmt = this.budgetLineForm.get('budgetAmt')?.value;
    this.budgetLine.actualAmt = this.budgetLineForm.get('actualAmt')?.value;
    this.budgetLine.variance = Number(this.budgetLine.budgetAmt) - Number(this.budgetLine.actualAmt);
    console.log(this.budgetLine);

    this.dataService.EditBudgetLine(this.id2, this.budgetLine).subscribe(result => {
      document.getElementById('cBtn').style.display = "none";
      document.querySelector('button').classList.toggle("is_active");

      this.log.action = "Edited Budget Line for: " + this.budgetLine.budget_Category.account_Name;
      this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
      let test: any
      test = new DatePipe('en-ZA');
      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
      this.dataService.AuditLogAdd(this.log).subscribe({
        next: (Log) => {
          this.router.navigate(['/ViewBudgetLines', this.id]);
        }
      })
    });
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
