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

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }


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
    profile_Picture: './assets/Images/Default_Profile.jpg',
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
      CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]]
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
    newPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.substring(4, 7));

    
    this.rl.role_ID = 0;
    this.rl.name = "Admin";
    this.rl.description = "Admin";

    this.usr.username = username;
    this.usr.password = newPassword;
    this.usr.role = this.rl;

    this.adm.adminName = this.myForm.get('AdminName')?.value;
    this.adm.adminSurname = this.myForm.get('AdminSurname')?.value;
    this.adm.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.adm.email = this.myForm.get('Email')?.value;
    this.adm.user.username = username;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(5, 3));

    var rlName = this.myForm.get('Role_ID')?.value;
    this.usr.username = username;
    this.usr.password = this.myForm.get('Password')?.value;

    this.dataService.UserValidation(username).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddUser(this.usr).subscribe(result => {
            this.dataService.AddAdmin(this.adm).subscribe(r => {
              this.router.navigate(['ViewAdmin'])
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

    
  }
}
