import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';

@Component({
  selector: 'app-edit-employee-role',
  templateUrl: './edit-employee-role.component.html',
  styleUrls: ['./edit-employee-role.component.css']
})
export class EditEmployeeRoleComponent implements OnInit {
  public myForm !: FormGroup;

  role:any
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });

    this.dataService.GetRole(+this.route.snapshot.params['id']).subscribe(result => {
      this.role = result
      console.log(result)
      this.myForm.patchValue({
        Name: this.role.name,
        Description: this.role.description
      });
    })
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewEmpRole');
  }

  onSubmit() {
    this.dataService.EditRole(this.role.role_ID, this.myForm.value).subscribe(result => {
      this.router.navigate(['ViewEmpRole'])
    })
  }
}
