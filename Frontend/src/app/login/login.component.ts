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
    console.log(this.loginConfirm)
  }

  // ForgotPass() {
  //   const dialogRef: MatDialogRef<ForgotPassDialogComponent> = this.dialog.open(ForgotPassDialogComponent, {
  //     disableClose: true
  //   });
  // }


  LoginUser() {
    this.loginConfirm = localStorage.getItem("User");
    this.userName = this.myForm.get('UserName')?.value;
    //console.log(this.userName)
    this.password = this.myForm.get('Password')?.value;

    this.dataService.GetActiveDelegations().subscribe({
      next: (r) => {
        this.activeDelegations = r;

        for (let i = 0; i < this.activeDelegations.length; i++) {
          let un = this.activeDelegations[i].user.username;
          console.log(un)
          console.log(this.userName)
          if (un == this.userName) {
            this.hasActiveDelegation = "true";
            this.delID = this.activeDelegations[i].delegation_ID;
            this.tempUsername = this.activeDelegations[i].delegatingParty;;
          }
        }

        if (this.hasActiveDelegation != "") {
          this.dataService.GetTempAcc(this.delID).subscribe({
            next: (ta) => {
              this.tempAccess = ta;

              this.dataService.loginWithTemp(this.userName, this.password, this.tempAccess.name, this.tempUsername).subscribe({
                next: (response) => {
                  if (response != null) {
                    console.log(response)
                    const stringToken = JSON.stringify(response)
                    console.log(stringToken)
                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours

                    sessionStorage.setItem("token", stringToken);
                    sessionStorage.setItem("tokenExpiration", expirationDate.getTime().toString());

                    console.log("Login Succeessss");


                    this.AuthServ.setUserRole(this.dataService.decodeUserRole(sessionStorage.getItem("token")))

                    this.myForm.reset();
                    this.router.navigate(['/Home']);
                    location.reload();
                  }


                },
                error: (error) => {
                  console.log(error)
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
                console.log(response)
                const stringToken = JSON.stringify(response)
                console.log(stringToken)
                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours

                sessionStorage.setItem("token", stringToken);
                sessionStorage.setItem("tokenExpiration", expirationDate.getTime().toString());

                console.log("Login Succeessss");


                this.AuthServ.setUserRole(this.dataService.decodeUserRole(sessionStorage.getItem("token")))

                this.myForm.reset();
                this.router.navigate(['/Home']);
                location.reload();
              }


            },
            error: (error) => {
              console.log(error)
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
      console.log(result)
      if (result != null) {
        let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        let OTP = Array(6).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        console.log(result)
        document.getElementById('loading').style.display = 'block';

        this.mail.Name = result.employeeName,
          this.mail.Username = result.user.username,
          this.mail.Password = OTP;
        this.mail.Email = this.Email;

        this.dataService.SendOTP(this.mail).subscribe({
          next: (Result) => {
            let MailName = this.mail.Name;
            let MailUserName = this.mail.Username;
            console.log(MailUserName)
            let NewPass = newPassword;
            let MailEmail = this.mail.Email;
            let userID = Number(result.user.user_Id);
            console.log(userID)

            this.dialog.open(OTPComponent, {
              data: { OTP, MailName, MailUserName, NewPass, MailEmail, userID },
              disableClose: true
            });

            this.dialog.afterAllClosed.subscribe({
              next: (TrueClose) => {
                var action = "Update";
                var title = "PASSWORD UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Password as been updated successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  location.reload();
                  dialogRef.close();
                }, duration);
              }
            })
          }
        })
      }

      else {
        this.dataService.getAdminbyEmail(this.Email).subscribe(result => {
          console.log(result)
          if (result != null) {
            let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
            let OTP = Array(6).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
            console.log(result)
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
                console.log(MailUserName)
                let NewPass = newPassword;
                let MailEmail = this.mail.Email;
                let userID = Number(result.user.user_Id);
                console.log(userID)

                this.dialog.open(OTPComponent, {
                  data: { OTP, MailName, MailUserName, NewPass, MailEmail, userID },
                  disableClose: true
                });

                this.dialog.afterAllClosed.subscribe({
                  next: (TrueClose) => {
                    var action = "Update";
                    var title = "PASSWORD UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Password as been updated successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      location.reload();
                      dialogRef.close();
                    }, duration);
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
