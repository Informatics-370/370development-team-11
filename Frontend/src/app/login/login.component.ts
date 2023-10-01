import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../DataService/AuthService';
import { MailData } from '../Shared/Mail';
import { Delegation_Of_Authority } from '../Shared/DelegationOfAuthority';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { OTPComponent } from '../otp/otp.component';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Role } from '../Shared/EmployeeRole';
import { Access } from '../Shared/Access';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';
import { DelegationStatus } from '../Shared/DelegationStatus';
import { Temporary_Access } from '../Shared/Temporary_Access';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class LoginComponent implements OnInit {

  userName: string = "";
  password: string = "";
  loginConfirm: string = "";

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }

  Email: string = "";

  myForm: FormGroup = new FormGroup({});

  fPass: FormGroup = new FormGroup({});

  activeDelegations: Delegation_Of_Authority[] = [];
  hasActiveDelegation: string = "";
  delID: any;

  tempAccess: any;
  tempUsername: any;
  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
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
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
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

  doas: DelegationStatus = {
    status_ID: 0,
    name: '',
    description: ''
  }

  doa: Delegation_Of_Authority = {
    delegation_ID: 0,
    user_Id: 0,
    admin_ID: 0,
    delegationStatus_ID: 0,
    from_Date: new Date(),
    to_Date: new Date(),
    delegation_Document: '',
    delegatingParty: '',
    user: this.usr,
    admin: this.adm,
    delegation_Status: this.doas
  }

  tA: Temporary_Access = {
    temp_Access_ID: 0,
    delegation_ID: 0,
    delegation_Of_Authority: this.doa,
    name: '',
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

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private Notifdialog: MatDialog, private sanitizer: DomSanitizer, private AuthServ: AuthService) { }


  ngOnInit(): void {
    document.getElementById('nav').style.visibility = "hidden";
    this.myForm = this.formBuilder.group({
      UserName: ['', []],
      Password: ['', []]
    })

    this.fPass = this.formBuilder.group({
      Email: ['', []]
    })
    this.loginConfirm = null;
  }

  // ForgotPass() {
  //   const dialogRef: MatDialogRef<ForgotPassDialogComponent> = this.dialog.open(ForgotPassDialogComponent, {
  //     disableClose: true
  //   });
  // }


  LoginUser() {
    this.loginConfirm = localStorage.getItem("User");
    this.userName = this.myForm.get('UserName')?.value;
    this.password = this.myForm.get('Password')?.value;

    this.dataService.GetActiveDelegations().subscribe({
      next: (r) => {
        this.activeDelegations = r;

        for (let i = 0; i < this.activeDelegations.length; i++) {
          let un = this.activeDelegations[i].user.username;
          if (un == this.userName) {
            this.hasActiveDelegation = "true";
            this.delID = this.activeDelegations[i].delegation_ID;
            this.tempUsername = this.activeDelegations[i].delegatingParty;
          }
        }

        if (this.hasActiveDelegation != "") {
          this.dataService.GetLoginTempAcc(this.delID).subscribe({
            next: (ta) => {
              this.tempAccess = ta;
              this.tA = this.tempAccess;
              this.tA.delegation_Of_Authority = this.doa;
              this.dataService.loginWithTemp(this.userName, this.password, this.tempAccess, this.tempUsername).subscribe({
                next: (response) => {
                  if (response != null) {
                    const stringToken = JSON.stringify(response)
                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours

                    sessionStorage.setItem("token", stringToken);
                    sessionStorage.setItem("tokenExpiration", expirationDate.getTime().toString());



                    this.AuthServ.setUserRole(this.dataService.decodeUserRole(sessionStorage.getItem("token")))

                    this.myForm.reset();
                    this.router.navigate(['/Home']);
                    location.reload();
                  }


                },
                error: (error) => {
                  if (error.status === 401) {
                    // Unauthorized: Invalid credentials
                    var action = "Error";
                    var title = "LOGIN FAILED";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Username/ Password is <strong style='color:red'> INCORRECT! </strong>");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      dialogRef.close();
                    }, duration);
                  } else {
                    // Handle other errors
                    // ...
                  }
                }
              })
            }
          })
        } else {
          this.dataService.login(this.userName, this.password).subscribe({
            next: (response) => {
              if (response != null) {

                const stringToken = JSON.stringify(response)

                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours

                sessionStorage.setItem("token", stringToken);
                sessionStorage.setItem("tokenExpiration", expirationDate.getTime().toString());




                this.AuthServ.setUserRole(this.dataService.decodeUserRole(sessionStorage.getItem("token")))
                this.log.action = "Logged In to the system";
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    this.myForm.reset();
                    this.router.navigate(['/Home']);
                    location.reload();
                  }
                })


              }


            },
            error: (error) => {

              if (error.status === 401) {
                // Unauthorized: Invalid credentials
                var action = "Error";
                var title = "LOGIN FAILED";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Username/ Password is <strong style='color:red'> INCORRECT! </strong>");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  dialogRef.close();
                }, duration);
              } else {
                // Handle other errors
                // ...
              }
            }
          })
        }
      }
    })
  }

  ResetPassword() {
    this.dataService.getEmployeebyEmail(this.Email).subscribe(result => {

      if (result != null) {
        let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        let OTP = Array(6).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        document.getElementById('loading').style.display = 'block';

        this.mail.Name = result.employeeName,
          this.mail.Username = result.user.username,
          this.mail.Password = OTP;
        this.mail.Email = this.Email;

        this.dataService.SendOTP(this.mail).subscribe({
          next: (Result) => {
            let MailName = this.mail.Name;
            let MailUserName = this.mail.Username;

            let NewPass = newPassword;
            let MailEmail = this.mail.Email;
            let userID = Number(result.user.user_Id);


            this.dialog.open(OTPComponent, {
              data: { OTP, MailName, MailUserName, NewPass, MailEmail, userID },
              disableClose: true
            });

            this.dialog.afterAllClosed.subscribe({
              next: (TrueClose) => {
                this.log.action = "Reset Password";
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    this.hideloader()
                  }
                })

              }
            })
          }
        })
      }

      else {
        this.dataService.getAdminbyEmail(this.Email).subscribe(result => {

          if (result != null) {
            let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
            let OTP = Array(6).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

            document.getElementById('loading').style.display = 'block';

            this.mail.Name = result.adminName,
              this.mail.Username = result.user.username,
              this.mail.Password = OTP;
            this.mail.Email = this.Email;

            this.dataService.SendOTP(this.mail).subscribe({
              next: (Result) => {
                this.hideloader()
                let MailName = this.mail.Name;
                let MailUserName = this.mail.Username;

                let NewPass = newPassword;
                let MailEmail = this.mail.Email;
                let userID = Number(result.user.user_Id);


                this.dialog.open(OTPComponent, {
                  data: { OTP, MailName, MailUserName, NewPass, MailEmail, userID },
                  disableClose: true
                });

                this.dialog.afterAllClosed.subscribe({
                  next: (TrueClose) => {
                    this.log.action = "Reset Password";
                    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                    let test: any
                    test = new DatePipe('en-ZA');
                    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                    this.dataService.AuditLogAdd(this.log).subscribe({
                      next: (Log) => {
                        this.hideloader()
                      }
                    })
                  }
                })
              }
            })
          }

          else {
            var action = "Update";
            var title = "RESET UNSUCCESSFUL";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("User does not exist. Please try again!");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 1750;
            setTimeout(() => {
              dialogRef.close();
              location.reload();
            }, duration);
          }
        })
      }
    })
  }

  hideloader() {
    document.getElementById('loading')
      .style.display = 'none';
  }

  Close() {
    this.myForm.reset();
  }



  /*container = document.getElementById('container');*/

  removeList() {
    document.getElementById('container').classList.remove("right-panel-active");
    /*this.container.classList.remove("right-panel-active");*/
  }

  addList() {
    document.getElementById('container').classList.add("right-panel-active");
    /*this.container.classList.add("right-panel-active");*/
  }


}
