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

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
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

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: '',
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

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.iName = localStorage.getItem("User");
    this.iName = this.iName.substr(1, this.iName.length - 2);
    this.iRole = localStorage.getItem("Role");
    this.iRole = this.iRole.substr(1, this.iRole.length - 2);

    if (this.iRole == "Admin") {
      this.rAdmin = "true";

      this.myForm = this.formBuilder.group({
        AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]],
        Role: ['', [Validators.required]],
      })

      this.GetAdmin();
    } else {
      this.myForm = this.formBuilder.group({
        Name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        Surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]],
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

      this.usr.role_ID = this.employee.user.role.role_ID
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
      
      console.log(this.cropImgPreview);
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
    var username = ts.concat(cel.toString().substring(4, 7));
    username = username.replace(/\s/g, "");

    localStorage.setItem("User", JSON.stringify(username))

    this.usr.username = username;

    this.dataService.UserValidation(username, this.usr.user_Id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.admin.user_Id).subscribe(result => {
            this.dataService.EditAdmin(this.adm, this.admin.admin_ID).subscribe({
              next: (response) => {
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
                  dialogRef.close();
                }, duration);
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
    var username = ts.concat(cel.toString().substring(4, 7));
    username = username.replace(/\s/g, "");

    localStorage.setItem("User", JSON.stringify(username))

    this.usr.username = username;
    this.usr.role_ID = this.myForm.get('Role')?.value;

    this.dataService.UserValidation(username, this.usr.user_Id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.employee.user_Id).subscribe(result => {
            this.dataService.EditEmployee(this.emp, this.employee.employeeID).subscribe({
              next: (response) => {
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
                  dialogRef.close();
                }, duration);
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
