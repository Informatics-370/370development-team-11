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
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditEmployeeComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  accForm: FormGroup = new FormGroup({});

  employee: any
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }



  userRoles: any[] = []
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

  Access: Access = {
    Access_ID: 0,
    IsAdmin: '',
    CanAccInv: '',
    CanAccFin: '',
    CanAccPro: '',
    CanAccVen: '',
    CanAccRep: '',
    CanViewPenPro: '',
    CanViewFlagPro: '',
    CanViewFinPro: '',
    CanAppVen: '',
    CanEditVen: '',
    CanDeleteVen: '',
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: '',
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

  cAccInv: string;
  cAccFin: string;
  cAccPro: string;
  cAccVen: string;
  cAccRep: string;
  cViewPenPro: string;
  cViewFlagPro: string;
  cViewFinPro: string;
  cAppVen: string;
  cEditVen: string;
  cDeleteVen: string;

  ngOnInit() {

    this.GetRoles();
    this.GetBranches();
    this.GetDepartments();
    this.GetMandates();

    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      Role: ['', [Validators.required]],
      Mandate: ['', [Validators.required]],
      Department: ['', [Validators.required]],
      Branch: ['', [Validators.required]]
    })

    this.accForm = this.formBuilder.group({
      canAccInv: ['', [Validators.required]],
      canAccFin: ['', [Validators.required]],
      canAccPro: ['', [Validators.required]],
      canAccVen: ['', [Validators.required]],
      canAccRep: ['', [Validators.required]],
      canViewPenPro: ['', [Validators.required]],
      canViewFlagPro: ['', [Validators.required]],
      canViewFinPro: ['', [Validators.required]],
      canAppVen: ['', [Validators.required]],
      canEditVen: ['', [Validators.required]],
      canDeleteVen: ['', [Validators.required]]
    })

    this.GetEmployee();


  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.userRoles = result;
      this.userRoles.forEach((element, index) => {
        if (element.name == "Admin") this.userRoles.splice(index, 1);
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

  GetEmployee() {
    this.dataService.GetEmployee(+this.route.snapshot.params['uid']).subscribe(result => {
      this.employee = result
      this.myForm.patchValue({
        Name: this.employee.employeeName,
        Surname: this.employee.employeeSurname,
        Email: this.employee.email,
        CellPhone_Num: this.employee.cellPhone_Num,
        Role: this.employee.user.role.role_ID,
        Mandate: this.employee.mandate_Limit.mandate_ID,
        Department: this.employee.department.department_ID,
        Branch: this.employee.branch.branch_ID,

      });

      this.accForm.patchValue({
        canAccInv: this.employee.user.access.canAccInv,
        canAccFin: this.employee.user.access.canAccFin,
        canAccPro: this.employee.user.access.canAccPro,
        canAccVen: this.employee.user.access.canAccVen,
        canAccRep: this.employee.user.access.canAccRep,
        canViewPenPro: this.employee.user.access.canViewPenPro,
        canViewFlagPro: this.employee.user.access.canViewFlagPro,
        canViewFinPro: this.employee.user.access.canViewFinPro,
        canAppVen: this.employee.user.access.canAppVen,
        canEditVen: this.employee.user.access.canEditVen,
        canDeleteVen: this.employee.user.access.canDeleteVen

      });

      this.Access = this.employee.user.access;
      this.emp.employeeName = this.employee.employeeName;
      this.emp.employeeSurname = this.employee.employeeSurname;
      this.emp.cellPhone_Num = this.employee.cellPhone_Num;
      this.emp.email = this.employee.email;
      this.emp.branch_ID = this.employee.branch.branch_ID;
      this.emp.department_ID = this.employee.department.department_ID;
      this.emp.mandate_ID = this.employee.mandate_Limit.mandate_ID;

      this.usr.access.IsAdmin = this.employee.user.access.isAdmin;
      this.usr.role_ID = this.employee.user.role.role_ID;
      this.usr.access_ID = this.employee.user.access.access_ID;
      this.usr.password = this.employee.user.password;
      this.usr.profile_Picture = this.employee.user.profile_Picture;

      if (this.employee.user.access.canAccInv == "true") {
        this.cAccInv = "true";
      }

      if (this.employee.user.access.canAccFin == "true") {
        this.cAccFin = "true";
      }

      if (this.employee.user.access.canAccPro == "true") {
        this.cAccPro = "true";
      }

      if (this.employee.user.access.canAccVen == "true") {
        this.cAccVen = "true";
      }

      if (this.employee.user.access.canAccRep == "true") {
        this.cAccRep = "true";
      }

      if (this.employee.user.access.canViewPenPro == "true") {
        this.cViewPenPro = "true";
      }

      if (this.employee.user.access.canViewFlagPro == "true") {
        this.cViewFlagPro = "true";
      }

      if (this.employee.user.access.canViewFinPro == "true") {
        this.cViewFinPro = "true";
      }

      if (this.employee.user.access.canAppVen == "true") {
        this.cAppVen = "true";
      }

      if (this.employee.user.access.canEditVen == "true") {
        this.cEditVen = "true";
      }

      if (this.employee.user.access.canDeleteVen == "true") {
        this.cDeleteVen = "true";
      }

    })
  }



  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  get af() {
    return this.accForm.controls;
  }

  public accError = (controlName: string, errorName: string) => {
    return this.accForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.accForm.reset();
    this.router.navigateByUrl('ViewEmployee');
  }

  onSubmit() {
    this.emp.employeeName = this.myForm.get('Name')?.value;
    this.emp.employeeSurname = this.myForm.get('Surname')?.value;
    this.emp.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.emp.email = this.myForm.get('Email')?.value;
    this.emp.branch_ID = this.myForm.get('Branch')?.value;
    this.emp.department_ID = this.myForm.get('Department')?.value;
    this.emp.mandate_ID = this.myForm.get('Mandate')?.value;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('Name')?.value;
    var surname = this.myForm.get('Surname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(3, 6));
    username = username.replace(/\s/g, "");


    this.usr.username = username;
    this.usr.role_ID = this.myForm.get('Role')?.value;

    this.usr.access.CanAccFin = this.accForm.get('canAccFin')?.value;
    this.usr.access.CanAccInv = this.accForm.get('canAccInv')?.value;
    this.usr.access.CanAccPro = this.accForm.get('canAccPro')?.value;
    this.usr.access.CanAccRep = this.accForm.get('canAccRep')?.value;
    this.usr.access.CanAccVen = this.accForm.get('canAccVen')?.value;
    this.usr.access.CanAppVen = this.accForm.get('canAppVen')?.value;
    this.usr.access.CanDeleteVen = this.accForm.get('canDeleteVen')?.value;
    this.usr.access.CanEditVen = this.accForm.get('canEditVen')?.value;
    this.usr.access.CanViewFinPro = this.accForm.get('canViewFinPro')?.value;
    this.usr.access.CanViewFlagPro = this.accForm.get('canViewFlagPro')?.value;
    this.usr.access.CanViewPenPro = this.accForm.get('canViewPenPro')?.value;



    console.log(this.usr)

    this.dataService.EditUserValidation(username, this.employee.user_Id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.employee.user_Id).subscribe(result => {
            this.dataService.EditEmployee(this.emp, this.employee.employeeID).subscribe({
              next: (response) => {


                this.log.action = "Edited Employee: " + this.emp.employeeName + " " + this.emp.employeeSurname;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    document.getElementById('AnimationBtn').classList.toggle("is_active");
                    document.getElementById('cBtn').style.display = "none";
                    var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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






  openEditEmployeeTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf';
    window.open(userManualUrl, '_blank');
  }
}
