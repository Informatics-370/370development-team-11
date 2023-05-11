import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../Shared/EmployeeRole';
import { DataService } from '../DataService/data-service';

@Component({
  selector: 'app-create-employee-role',
  templateUrl: './create-employee-role.component.html',
  styleUrls: ['./create-employee-role.component.css']
})
export class CreateEmployeeRoleComponent implements OnInit {
  public myForm !: FormGroup;
  constructor(private router: Router, private dataService: DataService) { }

  

  ngOnInit() {
    this.myForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
  
  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewEmpRole');
  }

  onSubmit() {
    console.log(this.myForm.value);
    this.dataService.AddRole(this.myForm.value).subscribe(result => {
      this.router.navigate(['ViewEmpRole'])
      
    })
  }
  
}
