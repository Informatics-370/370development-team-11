import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';
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
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
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

  adm: Admin = {
    admin_ID: 0,
    user_Id: 0,
    adminName: '',
    adminSurname: '',
    cellPhone_Num: '',
    email: '',
    user: this.usr,
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]]
    })
  }

  get f() {
    return this.myForm.controls;
  }



  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewAdmin');
  }


  onSubmit() {

    var newPassword = '';
    newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.substring(3, 6));
    username = username.replace(/\s/g, "");

    this.rl.role_ID = 0;
    this.rl.name = "Admin";
    this.rl.description = "Admin";

    this.Access.IsAdmin = 'true';
    this.Access.CanAccFin = 'false';
    this.Access.CanAccInv = 'false';
    this.Access.CanAccPro = 'false';
    this.Access.CanAccRep = 'false';
    this.Access.CanAccVen = 'false';
    this.Access.CanAppVen = 'false';
    this.Access.CanDeleteVen = 'false';
    this.Access.CanEditVen = 'false';
    this.Access.CanViewFinPro = 'false';
    this.Access.CanViewFlagPro = 'false';
    this.Access.CanViewPenPro = 'false';


    this.usr.username = username;
    this.usr.password = newPassword;
    this.usr.role = this.rl;
    this.usr.access = this.Access;

    this.adm.adminName = this.myForm.get('AdminName')?.value;
    this.adm.adminSurname = this.myForm.get('AdminSurname')?.value;
    this.adm.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.adm.email = this.myForm.get('Email')?.value;
    this.adm.user.username = username;


    var rlName = this.myForm.get('Role_ID')?.value;


    this.mail.Name = name;
    this.mail.Username = username;
    this.mail.Password = newPassword;
    this.mail.Email = this.myForm.get('Email')?.value;
    document.getElementById('loading').style.display = 'block';

    this.dataService.CreateUserValidation(username).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddUser(this.usr).subscribe(result => {
            this.dataService.AddAdmin(this.adm).subscribe(r => {
              this.dataService.SendEmail(this.mail).subscribe({
                next: (response) => {

                  if (response) {
                    hideloader();
                    document.getElementById('cBtn').style.display = "none";
                    document.getElementById('AnimationBtn').classList.toggle("is_active");
                  }

                  this.log.action = "Created Admin: " + this.adm.adminName + " " + this.adm.adminSurname;
                  this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                  let test: any
                  test = new DatePipe('en-ZA');
                  this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                  this.dataService.AuditLogAdd(this.log).subscribe({
                    next: (Log) => {
                      var action = "Create";
                      var title = "CREATE SUCCESSFUL";
                      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The admin <strong>" + name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

                      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                        disableClose: true,
                        data: { action, title, message }
                      });

                      const duration = 1750;
                      setTimeout(() => {
                        this.router.navigate(['/ViewAdmin']);
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
          var title = "ERROR: Admin Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The admin <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  openCreateAdminTab(): void {
    const userManualUrl = 'assets/PDF/CreateAdminUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
