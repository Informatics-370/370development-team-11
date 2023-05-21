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


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string = "";
  password: string = "";
  loginConfirm: string = "";

  myForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    document.getElementById('nav').style.visibility = "hidden";
    this.myForm = this.formBuilder.group({
      UserName: ['', []],
      Password: ['', []]
    })
    this.loginConfirm = null;
    console.log(this.loginConfirm)
  }


  LoginUser() {
    this.loginConfirm = localStorage.getItem("User");
    this.userName = this.myForm.get('UserName')?.value;
    this.password = this.myForm.get('Password')?.value;
    this.dataService.login(this.userName, this.password).subscribe({
      next: (response) => {
        if (response != null) {
          console.log(response)
          localStorage.setItem("User", JSON.stringify(response.username))
          localStorage.setItem("Role", JSON.stringify(response.role.name))

          this.myForm.reset();
          this.router.navigate(['/Home']);
        }

        else {
          console.log(response)
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
        }
      }
    })
  }
  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewEmployee']);
  }
}
