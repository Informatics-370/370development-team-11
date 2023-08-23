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
import { MailData } from '../Shared/Mail';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from '../Shared/Access';


import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateEmployeeComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }


  roles: any[] = []
  departments: any[] = []
  branches: any[] = []
  mandate_limits: any[] = []

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }

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

  Access: Access = {
    Access_ID: 0,
    IsAdmin: 'false',
    CanAccInv: 'false',
    CanAccFin: 'false',
    CanAccPro: 'false',
    CanAccVen: 'false',
    CanAccRep: 'false',
    CanViewPenPro: 'false',
    CanViewFlagPro: 'false',
    CanViewFinPro: 'false',
    CanAppVen: 'false',
    CanEditVen: 'false',
    CanDeleteVen: 'false',
  }
  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
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
      CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
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
    newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');


    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('EmployeeName')?.value;
    var surname = this.myForm.get('EmployeeSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.substring(3, 6));
    username = username.replace(/\s/g, "");



    this.rl = this.myForm.get('Role_ID')?.value;
    this.rl.role_ID = 0;

    if (this.rl.name == "MD") {
      this.Access.IsAdmin = 'true';
      this.Access.CanAccFin = 'true';
      this.Access.CanAccInv = 'true';
      this.Access.CanAccPro = 'true';
      this.Access.CanAccRep = 'true';
      this.Access.CanAccVen = 'true';
      this.Access.CanAppVen = 'true';
      this.Access.CanDeleteVen = 'true';
      this.Access.CanEditVen = 'true';
      this.Access.CanViewFinPro = 'true';
      this.Access.CanViewFlagPro = 'true';
      this.Access.CanViewPenPro = 'true';
    }
    else if (this.rl.name == "GRC") {
      this.Access.CanAccPro = 'true';
      this.Access.CanAccRep = 'true';
      this.Access.CanAccVen = 'true';
      this.Access.CanAppVen = 'true';
      this.Access.CanDeleteVen = 'true';
      this.Access.CanEditVen = 'true';
      this.Access.CanViewFinPro = 'true';
      this.Access.CanViewFlagPro = 'true';
      this.Access.CanViewPenPro = 'true';
    }
    else if (this.rl.name == "Finance") {
      this.Access.CanAccFin = 'true';
      this.Access.CanAccPro = 'true';
      this.Access.CanAccRep = 'true';
      this.Access.CanAccVen = 'true';
      this.Access.CanViewFinPro = 'true';
      this.Access.CanViewFlagPro = 'true';
      this.Access.CanViewPenPro = 'true';
    }
    else if (this.rl.name == "FD") {
      this.Access.CanAccFin = 'true';
      this.Access.CanAccPro = 'true';
      this.Access.CanAccRep = 'true';
      this.Access.CanAccVen = 'true';
      this.Access.CanViewFinPro = 'true';
      this.Access.CanViewFlagPro = 'true';
      this.Access.CanViewPenPro = 'true';
    }

    this.usr.username = username;
    this.usr.password = newPassword;
    this.usr.role = this.rl;
    this.usr.access = this.Access;

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

    this.mail.Name = name;
    this.mail.Username = username;
    this.mail.Password = newPassword;
    this.mail.Email = this.myForm.get('Email')?.value;
    document.getElementById('loading').style.display = 'block';
    document.querySelector('button').disabled;

    //console.log(cel.substring(7,3));
    //console.log(username);
    //console.log(this.roles);

    this.dataService.CreateUserValidation(username).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddUser(this.usr).subscribe(result => {
            this.dataService.AddEmployee(this.emp).subscribe(r => {
              this.dataService.SendEmail(this.mail).subscribe({
                next: (response) => {

                  if (response) {
                    hideloader();
                    document.getElementById('cBtn').style.display = "none";
                    document.querySelector('button').classList.toggle("is_active");
                  }

                  this.log.action = "Created Employee: " + this.emp.employeeName + " " + this.emp.employeeSurname;
                  this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                  let test: any
                  test = new DatePipe('en-ZA');
                  this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                  this.dataService.AuditLogAdd(this.log).subscribe({
                    next: (Log) => {
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


                }
              })
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
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
    }

  }

  openCreateEmployeeTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}


