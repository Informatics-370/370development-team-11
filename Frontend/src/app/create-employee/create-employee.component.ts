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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';



@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }


  roles: any[] = []
  departments: any[] = []
  branches: any[] = []
  mandate_limits: any[] = []

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
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249Z',
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    role: this.rl
  }

  emp: Employee = {
    employeeID: 0,
    user_Id: 0,
    department_ID: 0,
    branch_ID: 0,
    mandate_ID: 0,
    employeeName: '',
    employeeSurname: '',
    cellPhone_Num: '',
    email: '',
    branch: this.br,
    department: this.dep,
    user: this.usr,
    mandate_limit: this.ml
  }

  ngOnInit() {

    this.GetRoles();
    this.GetBranches();
    this.GetDepartments();
    this.GetMandates();

    this.myForm = this.formBuilder.group({
      EmployeeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      EmployeeSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]],
      Role_ID: ['', [Validators.required]],
      Mandate_ID: ['', [Validators.required]],
      Department_ID: ['', [Validators.required]],
      Branch_ID: ['', [Validators.required]]
    })
  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.roles = result;
      this.roles.forEach((element, index) => {
        if (element.name == "Admin") this.roles.splice(index, 1);
      });
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

  GetMandates() {
    this.dataService.GetMandateLimits().subscribe(result => {
      this.mandate_limits = result;
      console.log(this.mandate_limits);
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
    
    var newPassword = '';
    newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

    
    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('EmployeeName')?.value;
    var surname = this.myForm.get('EmployeeSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.substring(4, 7));

    this.rl = this.myForm.get('Role_ID')?.value;
    this.rl.role_ID = 0;
    
    this.usr.username = username;
    this.usr.password = newPassword;
    this.usr.role = this.rl;

    this.br = this.myForm.get('Branch_ID')?.value;
    this.br.branch_ID = 0;
    this.dep = this.myForm.get('Department_ID')?.value;
    this.dep.department_ID = 0;
    this.ml = this.myForm.get('Mandate_ID')?.value;
    this.ml.mandate_ID = 0;

    this.emp.employeeName = this.myForm.get('EmployeeName')?.value;
    this.emp.employeeSurname = this.myForm.get('EmployeeSurname')?.value;
    this.emp.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.emp.email = this.myForm.get('Email')?.value;
    this.emp.branch = this.br;
    this.emp.department = this.dep;
    this.emp.mandate_limit = this.ml;
    this.emp.user.username = username;

    //console.log(cel.substring(7,3));
    //console.log(username);
    //console.log(this.roles);

    this.dataService.UserValidation(username).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddUser(this.usr).subscribe(result => {
            this.dataService.AddEmployee(this.emp).subscribe({
              next: (response) => {
                console.log(response);
                var action = "Create";
                var title = "CREATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/ViewEmployee']);
                  dialogRef.close();
                }, duration);
              }
            })

          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: User Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })
      
  }
}


