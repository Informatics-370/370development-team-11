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


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer, private AuthServ: AuthService) { }


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
    this.password = this.myForm.get('Password')?.value;
    this.dataService.login(this.userName, this.password).subscribe({
      next: (response) => {
        if (response != null) {
          console.log(response)
          const stringToken = JSON.stringify(response)
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
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The User <strong>" + this.userName + "</strong>  <strong style='color:red'> DOES NOT EXIST! </strong>");

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

  ResetPassword() {
    this.dataService.getEmployeebyEmail(this.Email).subscribe(result => {
      console.log(result)
      if (result != null) {
        let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        console.log(result)
        this.mail.Name = result.employeeName,
          this.mail.Username = result.user.username,
          this.mail.Password = newPassword;
        this.mail.Email = this.Email;
        document.getElementById('loading').style.display = 'block';

        this.dataService.UpdatePassword(result.user.user_Id, newPassword).subscribe({
          next: (response) => {
            if (response) {
              this.dataService.SendPasswordEmail(this.mail).subscribe({
                next: (response) => {

                  if (response) {
                    this.hideloader();
                  }

                  var action = "Update";
                  var title = "PASSWORD UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Password as been updated successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['']);
                    dialogRef.close();
                  }, duration);
                }
              })
            }
          }
        })
      }

      else {
        this.dataService.getAdminbyEmail(this.Email).subscribe(result => {
          console.log(result)
          if (result != null) {
            let newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
            console.log(result)
            this.mail.Name = result.adminName,
              this.mail.Username = result.user.username,
              this.mail.Password = newPassword;
            this.mail.Email = this.Email;
            document.getElementById('loading').style.display = 'block';

            this.dataService.UpdatePassword(result.user.user_Id, newPassword).subscribe({
              next: (response) => {

                console.log(response)
                if (response) {
                  this.dataService.SendPasswordEmail(this.mail).subscribe({
                    next: (response) => {

                      if (response) {
                        this.hideloader();
                      }

                      var action = "Update";
                      var title = "PASSWORD UPDATE SUCCESSFUL";
                      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Your Password as been updated successfully!");

                      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                        disableClose: true,
                        data: { action, title, message }
                      });

                      const duration = 1750;
                      setTimeout(() => {
                        this.router.navigate(['']);
                        dialogRef.close();
                      }, duration);
                    }
                  })
                }
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
    this.router.navigate(['/ViewEmployee']);
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
