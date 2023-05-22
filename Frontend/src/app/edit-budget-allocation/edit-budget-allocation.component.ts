import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Department } from '../Shared/Department';

@Component({
  selector: 'app-edit-budget-allocation',
  templateUrl: './edit-budget-allocation.component.html',
  styleUrls: ['./edit-budget-allocation.component.css']
})
export class EditBudgetAllocationComponent {

  dep: Department = {
    department_ID: 0,
    name: '',
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

  departments: any[] = []

  budgetAllocationForm: FormGroup = new FormGroup({});
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetBudgetAllocation(id);
    this.GetDepartments();
    this.budgetAllocationForm = this.formBuilder.group({
      department_ID: ['', [Validators.required]],
      date_Created: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]+$")]],
      total: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]]
    })
  }

  onSubmit(): void {

    this.dep = this.budgetAllocationForm.get('department_ID')?.value;
    this.dep.department_ID = 0;
    this.budgetAllocation.department = this.dep;
    this.budgetAllocation.date_Created = this.budgetAllocationForm.get('date_Created')?.value;
    this.budgetAllocation.year = this.budgetAllocationForm.get('year')?.value;
    this.budgetAllocation.total = this.budgetAllocationForm.get('total')?.value;
    console.log(this.budgetAllocation);

    this.dataService.EditBudgetAllocation(this.budgetAllocation.budget_ID, this.budgetAllocation).subscribe(result => {
      this.router.navigate(['/ViewBudgetAllocation']);
    });
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe((data: any[]) => {
      this.departments = data;
    })
  }

  GetBudgetAllocation(id: number) {
    this.dataService.GetBudgetAllocation(id).subscribe((data: any) => {
      this.budgetAllocation = data;
    })
  }

  onCancel(): void {
    this.budgetAllocationForm.reset();
    this.router.navigate(['/ViewBudgetAllocation']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.budgetAllocationForm.controls[controlName].hasError(errorName);
  }
}
