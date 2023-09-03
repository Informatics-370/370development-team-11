import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { MailData } from '../Shared/Mail';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { Dialog } from '@angular/cdk/dialog';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit {

  countdownDuration: number = 120; // Countdown duration in seconds
  countdown: number = this.countdownDuration;
  SpinnerProgress: number = this.countdown;
  countdownInterval: any; // Variable to hold the interval reference
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }



  constructor(@Inject(MAT_DIALOG_DATA) public data: { OTP: String, MailName: String, MailUserName: String, NewPass: String, MailEmail: String, userID: Number }, private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<OTPComponent>, private dialog: MatDialog) { }
  myForm: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      OTP: ["", [Validators.required]]
    })
    this.mail.Name = this.data.MailName,
      this.mail.Username = this.data.MailUserName,
      this.mail.Password = this.data.NewPass;
    this.mail.Email = this.data.MailEmail;

    this.startCountdown();

  }

  OnOTPConfirm() {

    let OTPVAL = this.myForm.get("OTP")?.value
    if (OTPVAL == this.data.OTP) {
      this.dataservice.UpdatePassword(this.data.userID, this.data.NewPass).subscribe({
        next: (response) => {
          this.mail.Name = this.mail.Name,
            this.mail.Username = this.mail.Username,
            this.mail.Password = this.data.NewPass;
          this.mail.Email = this.mail.Email;
          if (response) {
            this.dataservice.SendPasswordEmail(this.mail).subscribe({
              next: (response) => {
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
        }
      })
    }

    else {
      var action = "OTP";
      var title = "OTP DOES NOT MATCH";
      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The OTP you have provided is Incorrect");

      const NotifdialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
        disableClose: true,
        data: { action, title, message }
      });

      const duration = 1750;
      setTimeout(() => {
        NotifdialogRef.close();
      }, duration);
    }
  }

  ResendEmail(event: Event) {
    event.preventDefault();
    this.mail.Name = this.mail.Name,
      this.mail.Username = this.mail.Username,
      this.mail.Password = this.data.OTP;
    this.mail.Email = this.mail.Email;
    this.dataservice.SendOTP(this.mail).subscribe({
      next: (Result) => {

        var action = "EMAIL";
        var title = "EMAIL HAS BEEN SENT";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The email has been sent!");

        const NotifdialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          NotifdialogRef.close();
        }, duration);
        this.color = 'primary'
        this.countdownDuration = 120; // Countdown duration in seconds
        this.SpinnerProgress = 120;
        this.countdown = this.countdownDuration;
        document.getElementById("Spinner").style.display = "flex"
        this.startCountdown();
        this.myForm.reset()
        document.getElementById("ResendLink").style.display = "none"
      }
    })
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0 && this.countdown >= 20) {
        this.countdown--;
        this.SpinnerProgress = (this.countdown / 120) * 100
      }
      else if (this.countdown <= 20 && this.countdown > 0) {
        this.color = 'warn'
        this.countdown--;
        this.SpinnerProgress = (this.countdown / 120) * 100
      }
      else {
        clearInterval(this.countdownInterval);
        document.getElementById("Spinner").style.display = "none"
        document.getElementById("ResendLink").style.display = "block"
        let OTP = Array(6).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        this.data.OTP = OTP;
        this.myForm.invalid
      }
    }, 1000);
  }

  Close() {
    this.dialogRef.close()
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}
