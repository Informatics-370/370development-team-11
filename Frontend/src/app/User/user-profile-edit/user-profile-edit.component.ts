import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from '../../Shared/Admin';
import { Role } from '../../Shared/EmployeeRole';
import { User } from '../../Shared/User';
import { Branch } from '../../Shared/Branch';
import { Department } from '../../Shared/Department';
import { Mandate_Limit } from '../../Shared/MandateLimit';
import { Employee } from '../../Shared/Employee';
import { NotificationdisplayComponent } from '../../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef } from '@angular/material/dialog';
import { CropperModalComponent } from '../cropper-modal/cropper-modal.component';
import { MainNavComponent } from '../../main-nav/main-nav.component';
import { MatIconRegistry } from '@angular/material/icon';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from 'src/app/Shared/Access';

//const CHECK_ICON = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 29.756 29.756" style="enable-background:new 0 0 29.756 29.756;" xml:space="preserve">

//                <path d="M29.049,5.009L28.19,4.151c-0.943-0.945-2.488-0.945-3.434,0L10.172,18.737l-5.175-5.173   c-0.943-0.944-2.489-0.944-3.432,0.001l-0.858,0.857c-0.943,0.944-0.943,2.489,0,3.433l7.744,7.752   c0.944,0.943,2.489,0.943,3.433,0L29.049,8.442C29.991,7.498,29.991,5.953,29.049,5.009z" />
// </svg>`;

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css'],
  providers: [MainNavComponent],
})
export class UserProfileEditComponent {
  imgChangeEvt: string = '';
  file: string = '';
  iName: string;
  iRole: string;
  rAdmin: string;
  admin: any;
  employee: any;
  myForm: FormGroup = new FormGroup({});
  cropImgPreview: string = '';

  fileToUpload: File | null = null;
  files: any[] = ['', '', ''];

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

  adm: Admin = {
    admin_ID: 0,
    user_Id: 0,
    adminName: '',
    adminSurname: '',
    cellPhone_Num: '',
    email: '',
    user: this.usr,
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer, private nav: MainNavComponent, iconRegistry: MatIconRegistry) {
    /*iconRegistry.addSvgIconLiteral('check', sanitizer.bypassSecurityTrustHtml(CHECK_ICON));*/
  }

  ngOnInit(): void {
    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin") {
      this.rAdmin = "true";

      this.myForm = this.formBuilder.group({
        AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
        Role: ['', [Validators.required]],
      })

      this.GetAdmin();
    } else {
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

      this.GetEmployee();
    }
  }

  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  GetEmployee() {
    this.dataService.GetEmployeeByUsername(this.iName).subscribe(result => {
      this.employee = result

      this.emp.employeeName = this.employee.employeeName;
      this.emp.employeeSurname = this.employee.employeeSurname;
      this.emp.cellPhone_Num = this.employee.cellPhone_Num;
      this.emp.email = this.employee.email;
      this.emp.branch_ID = this.employee.branch.branch_ID;
      this.emp.department_ID = this.employee.department.department_ID;
      this.emp.mandate_ID = this.employee.mandate_Limit.mandate_ID;

      this.usr.role_ID = this.employee.user.role.role_ID;
      this.usr.access = this.employee.user.access;
      this.usr.password = this.employee.user.password;
      this.usr.profile_Picture = this.employee.user.profile_Picture;
      this.cropImgPreview = this.employee.user.profile_Picture;

      this.myForm.patchValue({
        Name: this.employee.employeeName,
        Surname: this.employee.employeeSurname,
        Email: this.employee.email,
        CellPhone_Num: this.employee.cellPhone_Num,
        Role: this.employee.user.role.role_ID,
        Mandate: this.employee.mandate_Limit.mandate_ID,
        Department: this.employee.department.department_ID,
        Branch: this.employee.branch.branch_ID,
      })
    })
  }

  GetAdmin() {
    this.dataService.GetAdminByUsername(this.iName).subscribe(result => {
      this.admin = result
      this.usr.role_ID = this.admin.user.role.role_ID
      this.usr.access = this.admin.user.access;
      console.log(this.admin.user.access.access_ID)
      this.usr.password = this.admin.user.password;
      this.usr.profile_Picture = this.admin.user.profile_Picture;
      this.cropImgPreview = this.admin.user.profile_Picture;
      this.myForm.patchValue({
        AdminName: this.admin.adminName,
        AdminSurname: this.admin.adminSurname,
        Email: this.admin.email,
        CellPhone_Num: this.admin.cellPhone_Num,
        Role: this.admin.user.role.role_ID
      });
    })
  }

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
    var img = this.imgChangeEvt;
    console.log(event.target.files[0].name);

    const dialogRef: MatDialogRef<CropperModalComponent> = this.dialog.open(CropperModalComponent, {
      disableClose: true,
      data: { img }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cropImgPreview = result;
      this.usr.profile_Picture = this.cropImgPreview;
      var fileName = event.target.files[0].name;
    })
  }

  onSubmitA() {


    this.adm.adminName = this.myForm.get('AdminName')?.value;
    this.adm.adminSurname = this.myForm.get('AdminSurname')?.value;
    this.adm.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.adm.email = this.myForm.get('Email')?.value;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(3, 6));
    username = username.replace(/\s/g, "");

    localStorage.setItem("User", JSON.stringify(username))

    this.usr.username = username;

    this.dataService.EditUserValidation(username, this.usr.user_Id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.admin.user_Id).subscribe(result => {
            this.dataService.EditAdmin(this.adm, this.admin.admin_ID).subscribe({
              next: (response) => {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");

                this.log.action = "Edited User Profile for: " + this.adm.adminName + " " + this.adm.adminSurname;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your profile has been <strong style='color:green'> UPDATED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      this.router.navigate(['/Profile']);
                      //this.nav.reload();
                      //const NavbarElement = document.getElementById("nav");
                      //NavbarElement.innerHTML = NavbarElement.innerHTML;
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
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("A user with the username: <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  onSubmitE() {
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

    localStorage.setItem("User", JSON.stringify(username))

    this.usr.username = username;
    this.usr.role_ID = this.myForm.get('Role')?.value;

    this.dataService.EditUserValidation(username, this.usr.user_Id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.employee.user_Id).subscribe(result => {
            this.dataService.EditEmployee(this.emp, this.employee.employeeID).subscribe({
              next: (response) => {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");

                this.log.action = "Edited User Profile for: " + this.emp.employeeName + " " + this.emp.employeeSurname;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your profile has been <strong style='color:green'> UPDATED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      this.router.navigate(['/Profile']);
                      //this.nav.reload();
                      //const NavbarElement = document.getElementById("nav");
                      //NavbarElement.innerHTML = NavbarElement.innerHTML;
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
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("A user with the username: <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('Profile');
  }

}
