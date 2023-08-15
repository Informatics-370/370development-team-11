import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from '../Shared/Access';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  admin: any
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }



  userRoles: any[] = []

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }
  Access: Access = {
    Access_ID: 0,
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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  ngOnInit() {

    this.GetRoles();


    this.myForm = this.formBuilder.group({
      AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      Role: ['', [Validators.required]],
    })

    this.GetAdmin();


  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.userRoles = result;
    });
  }

  GetAdmin() {
    this.dataService.GetAdmin(+this.route.snapshot.params['uid']).subscribe(result => {
      this.admin = result
      this.usr.role_ID = this.admin.user.role.role_ID
      this.usr.password = this.admin.user.password;
      this.myForm.patchValue({
        AdminName: this.admin.adminName,
        AdminSurname: this.admin.adminSurname,
        Email: this.admin.email,
        CellPhone_Num: this.admin.cellPhone_Num,
        Role: this.admin.user.role.role_ID
      });
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
    this.adm.adminName = this.myForm.get('AdminName')?.value;
    this.adm.adminSurname = this.myForm.get('AdminSurname')?.value;
    this.adm.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.adm.email = this.myForm.get('Email')?.value;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(3, 6));
    username = username.replace(/\s/g, "");

    this.usr.username = username;
    var id = this.usr.user_Id;

    //this.dataService.EditUser(this.usr, this.route.snapshot.params['uid']).subscribe(r => {
    //  this.dataService.EditAdmin(this.adm, this.route.snapshot.params['uid']).subscribe(result => {
    //    this.router.navigateByUrl('ViewAdmin');
    //  })
    //})

    this.dataService.EditUserValidation(username, id).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditUser(this.usr, this.admin.user_Id).subscribe(result => {
            this.dataService.EditAdmin(this.adm, this.admin.admin_ID).subscribe({
              next: (response) => {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");

                this.log.action = "Edited Admin: " + this.adm.adminName;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The admin <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
        }
        else {
          var action = "ERROR";
          var title = "ERROR: User Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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
