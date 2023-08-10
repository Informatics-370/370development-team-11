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
import { AuditLog } from 'src/app/Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  providers: [MainNavComponent]
})
export class UpdatePasswordComponent implements OnInit {
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

    this.myForm = this.formBuilder.group({
      CurrentPass: ['', [Validators.required]],
      NewPass: ['', [Validators.required]],
    })

    this.dataService.GetUserByUsername(this.iName).subscribe({
      next: (Response) => {
        this.usr = Response
      }
    })
  }


  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  UpdatePassword() {

    var Username = this.iName;
    var UserID = this.usr.user_Id;
    var Password = this.myForm.get("CurrentPass")?.value;
    var NewPassword = this.myForm.get("NewPass")?.value;
    //Validate Current Password
    this.dataService.VerifyCredentials(Username, Password).subscribe({
      next: (response) => {
        console.log(response)
        if (response == true) {
          this.dataService.UpdatePassword(UserID, NewPassword).subscribe({
            next: (Response) => {
              if (Response != null) {

                this.log.action = "Updatet User Password";
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Password for <strong>" + this.usr.username + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      dialogRef.close();
                      this.Logout();
                    }, duration);
                  }
                })
              }
            }
          })
        }

        else {
          var action = "Update";
          var title = "UPDATE UNSUCCESSFUL";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Password for <strong>" + this.usr.username + "</strong><strong style='color:red'> DOES NOT MATCH </strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }

      },
      error: (error) => {
        var action = "Update";
        var title = "UPDATE UNSUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Password for <strong>" + this.usr.username + "</strong><strong style='color:red'> DOES NOT MATCH! </strong>");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      }
    })
  }

  Logout() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("tokenExpiration")
    this.router.navigate([""]);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('Profile');
  }


}
