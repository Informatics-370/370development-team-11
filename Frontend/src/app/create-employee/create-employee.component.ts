import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';
import { Employee } from '../Shared/Employee';
import { Branch } from '../Shared/Branch';
import { Department } from '../Shared/Department';
import { User } from '../Shared/User';
import { Mandate_Limit } from '../Shared/MandateLimit';



@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private formBuilder: FormBuilder, private dataService: DataService) { }

  roles: any[] = []
  departments: any[] = []
  branches: any[] = []
  mandate_limits: any[] = ['10000', '20000', '30000']

  br: Branch = {
    branch_ID: 0,
    name: '',
    street: '',
    city: '',
    postal_Code: '',
    province: '',
  }

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  ml: Mandate_Limit = {
    Mandate_ID: 0,
    Ammount: 0,
    Date: '2023-05-07T12:14:46.249Z',
  }

  rl: Role = {
    Role_ID: 0,
    Name: '',
    Description: ''
  }

  usr: User = {
    User_Id: 0,
    Role_ID: 0,
    Username: '',
    Password: '',
    Profile_Picture: './assets/Images/Default_Profile.jpg',
    role: this.rl
  }

  emp: Employee = {
    EmployeeID: 0,
    User_Id: 0,
    Department_ID: 0,
    Branch_ID: 0,
    Mandate_ID: 0,
    EmployeeName: '',
    EmployeeSurname: '',
    CellPhone_Num: '',
    Email: '',
    branch: this.br,
    department: this.dep,
    user: this.usr,
    mandate_limit: this.ml
  }

  ngOnInit() {

    this.GetRoles();
    this.GetBranches();
    this.GetDepartments();

    this.myForm = this.formBuilder.group({
      EmployeeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      EmployeeSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$')]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]],
      Role_ID: ['', [Validators.required]],
      Department_ID: ['', [Validators.required]],
      Branch_ID: ['', [Validators.required]],
      Mandate_ID: ['', [Validators.required]]
    })
  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.roles = result;
    });
  }

  GetBranches() {
    this.dataService.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetDepartments() {
    this.dataService.GetDepartments().subscribe(result => {
      this.departments = result;
    });
  }

  get f() {
    return this.myForm.controls;
  }

  

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewEmployee');
  }


  onSubmit() {
    var usrName = this.myForm.get('Username')?.value;
    var brName = this.myForm.get('Branch_ID')?.value;
    var depName = this.myForm.get('Department_ID')?.value;
    var mlAmount = this.myForm.get('Mandate_ID')?.value;
    this.emp.EmployeeName = this.myForm.get('EmployeeName')?.value;
    this.emp.EmployeeSurname = this.myForm.get('EmployeeSurname')?.value;
    this.emp.CellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.emp.Email = this.myForm.get('Email')?.value;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('Name')?.value;
    var surname = this.myForm.get('Surname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(0, 3));

    var rlName = this.myForm.get('Role_ID')?.value;
    this.usr.Username = username;
    this.usr.Password = this.myForm.get('Password')?.value;
    

    this.dataService.AddUser(this.usr, rlName).subscribe(result => {
      this.dataService.AddEmployee(this.emp, usrName, brName, depName, mlAmount).subscribe(r => {
        this.router.navigate(['ViewEmployee'])
      })
        
    })
  }
}


