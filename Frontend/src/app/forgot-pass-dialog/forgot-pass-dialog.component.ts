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
  selector: 'app-forgot-pass-dialog',
  templateUrl: './forgot-pass-dialog.component.html',
  styleUrls: ['./forgot-pass-dialog.component.css']
})
export class ForgotPassDialogComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer, private AuthServ: AuthService) { }

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }

  Email: string = "";
  ngOnInit(): void {
    document.getElementById('nav').style.visibility = "hidden";
    this.myForm = this.formBuilder.group({
      EmailUsername: ['', []],
    })
  }

  hideloader() {
    document.getElementById('loading')
      .style.display = 'none';
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
    }
    )
  }
}

