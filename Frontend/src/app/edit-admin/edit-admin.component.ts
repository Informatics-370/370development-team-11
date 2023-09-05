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




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css'], 
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  accForm: FormGroup = new FormGroup({});

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
    profile_Picture: '',
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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  cAccInv: string;
  cAccFin: string;
  cAccPro: string;
  cAccVen: string;
  cAccRep: string;
  cViewPenPro: string;
  cViewFlagPro: string;
  cViewFinPro: string;
  cAppVen: string;
  cEditVen: string;
  cDeleteVen: string;

  ngOnInit() {

    this.GetRoles();


    this.myForm = this.formBuilder.group({
      AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      Role: ['', [Validators.required]],
    })

    this.accForm = this.formBuilder.group({
      canAccInv: ['', [Validators.required]],
      canAccFin: ['', [Validators.required]],
      canAccPro: ['', [Validators.required]],
      canAccVen: ['', [Validators.required]],
      canAccRep: ['', [Validators.required]],
      canViewPenPro: ['', [Validators.required]],
      canViewFlagPro: ['', [Validators.required]],
      canViewFinPro: ['', [Validators.required]],
      canAppVen: ['', [Validators.required]],
      canEditVen: ['', [Validators.required]],
      canDeleteVen: ['', [Validators.required]]
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

      this.accForm.patchValue({
        canAccInv: this.admin.user.access.canAccInv,
        canAccFin: this.admin.user.access.canAccFin,
        canAccPro: this.admin.user.access.canAccPro,
        canAccVen: this.admin.user.access.canAccVen,
        canAccRep: this.admin.user.access.canAccRep,
        canViewPenPro: this.admin.user.access.canViewPenPro,
        canViewFlagPro: this.admin.user.access.canViewFlagPro,
        canViewFinPro: this.admin.user.access.canViewFinPro,
        canAppVen: this.admin.user.access.canAppVen,
        canEditVen: this.admin.user.access.canEditVen,
        canDeleteVen: this.admin.user.access.canDeleteVen

      });

      this.Access = this.admin.user.access;
      this.usr.access.IsAdmin = this.admin.user.access.isAdmin;
      this.usr.access_ID = this.admin.user.access.access_ID;

      if (this.admin.user.access.canAccInv == "true") {
        this.cAccInv = "true";
      }

      if (this.admin.user.access.canAccFin == "true") {
        this.cAccFin = "true";
      }

      if (this.admin.user.access.canAccPro == "true") {
        this.cAccPro = "true";
      }

      if (this.admin.user.access.canAccVen == "true") {
        this.cAccVen = "true";
      }

      if (this.admin.user.access.canAccRep == "true") {
        this.cAccRep = "true";
      }

      if (this.admin.user.access.canViewPenPro == "true") {
        this.cViewPenPro = "true";
      }

      if (this.admin.user.access.canViewFlagPro == "true") {
        this.cViewFlagPro = "true";
      }

      if (this.admin.user.access.canViewFinPro == "true") {
        this.cViewFinPro = "true";
      }

      if (this.admin.user.access.canAppVen == "true") {
        this.cAppVen = "true";
      }

      if (this.admin.user.access.canEditVen == "true") {
        this.cEditVen = "true";
      }

      if (this.admin.user.access.canDeleteVen == "true") {
        this.cDeleteVen = "true";
      }
    })
  }



  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  get af() {
    return this.accForm.controls;
  }

  public accError = (controlName: string, errorName: string) => {
    return this.accForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.accForm.reset();
    this.router.navigateByUrl('ViewAdmin');
  }

  onSubmit() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
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

    this.usr.access.CanAccFin = this.accForm.get('canAccFin')?.value;
    this.usr.access.CanAccInv = this.accForm.get('canAccInv')?.value;
    this.usr.access.CanAccPro = this.accForm.get('canAccPro')?.value;
    this.usr.access.CanAccRep = this.accForm.get('canAccRep')?.value;
    this.usr.access.CanAccVen = this.accForm.get('canAccVen')?.value;
    this.usr.access.CanAppVen = this.accForm.get('canAppVen')?.value;
    this.usr.access.CanDeleteVen = this.accForm.get('canDeleteVen')?.value;
    this.usr.access.CanEditVen = this.accForm.get('canEditVen')?.value;
    this.usr.access.CanViewFinPro = this.accForm.get('canViewFinPro')?.value;
    this.usr.access.CanViewFlagPro = this.accForm.get('canViewFlagPro')?.value;
    this.usr.access.CanViewPenPro = this.accForm.get('canViewPenPro')?.value;

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
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";

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
          document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
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


  openEditAdminTab(): void {
    const userManualUrl = 'assets/PDF/EditAdminUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
