import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { DataService } from '../../DataService/data-service';
import { NotificationdisplayComponent } from '../../notificationdisplay/notificationdisplay.component';
import { Admin } from '../../Shared/Admin';
import { Delegation_Of_Authority } from '../../Shared/DelegationOfAuthority';
import { DelegationStatus } from '../../Shared/DelegationStatus';
import { Role } from '../../Shared/EmployeeRole';
import { User } from '../../Shared/User';
import { DatePipe } from '@angular/common';
import { AuditLog } from '../../Shared/AuditLog';
import { Access } from 'src/app/Shared/Access';
import { Temporary_Access } from '../../Shared/Temporary_Access';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-delegation',
  templateUrl: './edit-delegation.component.html',
  styleUrls: ['./edit-delegation.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditDelegationComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  user: any
  admin: any;
  iName: string;
  delegation: any;
  tempaccess: any;
  delID: number;

  myControl = new FormControl<string | User>('', [Validators.minLength(2), Validators.required]);
  options: User[] = [];
  SearchedOptions: Observable<User[]>;
  delegateID: any

  fileToUpload: File | null = null;
  files: any[] = [''];
  sPath = "";

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

  ta: Temporary_Access = {
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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  delegateUser: any;

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      DelegatingName: [''],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      DelegationFile: ['', [Validators.required]]
    })

    this.getDelegation();
    this.getTempAccess();

    

    this.SearchedOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.username;
        return name ? this._filter(name as string) : this.options.slice();
      })
    )

  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(r => r.username.toLowerCase().includes(filterValue));
  }

  public onFocus(event: FocusEvent) {
    (event.target as any).blur();
  }

  getDelegation() {
    this.dataService.GetDelegation(+this.route.snapshot.params['did']).subscribe(r => {
      this.delegation = r;

      this.myForm.patchValue({
        DelegatingName: this.delegation.delegatingParty,
        start: this.delegation.from_Date,
        end: this.delegation.to_Date,
        DelegationFile: this.delegation.delegation_Document
      });

      this.myForm.get('DelegatingName').disable();

      this.myControl.setValue(this.delegation.user.username);

      this.delID = this.delegation.delegation_ID;
      this.doa.user_Id = this.delegation.user_Id;
      this.delegateUser = this.delegation.user.username;
      this.doa.user = this.delegation.user;
      this.doa.admin_ID = this.delegation.admin_ID;
      this.doa.delegationStatus_ID = this.delegation.delegationStatus_ID;
      this.doa.from_Date = this.delegation.from_Date;
      this.doa.to_Date = this.delegation.to_Date;
      this.doa.delegation_Document = this.delegation.delegation_Document;
      this.doa.delegatingParty = this.delegation.delegatingParty;

      this.dataService.GetUsers().subscribe(r => {
        this.options = r
        this.options.forEach((element, i) => {
          if (element.username == this.delegation.delegatingParty) this.options.splice(i, 1);
          
        })

        this.options.forEach((el, idx) => {
          if (el.role.name == "Admin") this.options.splice(idx, 1);
        })
      })
    })
  }

  getTempAccess() {
    this.dataService.GetTempAcc(+this.route.snapshot.params['did']).subscribe(r => {
      this.tempaccess = r;
      this.ta.name = this.tempaccess.name;
      this.ta.IsAdmin = this.tempaccess.isAdmin;
      this.ta.CanAccInv = this.tempaccess.canAccInv;
      this.ta.CanAccFin = this.tempaccess.canAccFin;
      this.ta.CanAccPro = this.tempaccess.canAccPro;
      this.ta.CanAccVen = this.tempaccess.canAccVen;
      this.ta.CanAccRep = this.tempaccess.canAccRep;
      this.ta.CanViewPenPro = this.tempaccess.canViewPenPro;
      this.ta.CanViewFlagPro = this.tempaccess.canViewFlagPro;
      this.ta.CanViewFinPro = this.tempaccess.canViewFinPro;
      this.ta.CanAppVen = this.tempaccess.canAppVen;
      this.ta.CanEditVen = this.tempaccess.canEditVen;
      this.ta.CanDeleteVen = this.tempaccess.canDeleteVen;
    })
  }

  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  public myControlError = (errorName: string) => {
    return this.myControl.hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('Delegation');
  }

 

  getPosts(username) {
    this.delegateUser = username;

    this.dataService.GetUserByUsername(username).subscribe(r => {
      this.delegateID = r;
      this.doa.user_Id = this.delegateID.user_Id;

      if (this.ta.IsAdmin == "false" && this.delegateID.access.isAdmin == "true") {
        this.ta.IsAdmin = "true";
      }

      if (this.ta.CanAccFin == "false" && this.delegateID.access.canAccFin == "true") {
        this.ta.CanAccFin = "true";
      }

      if (this.ta.CanAccInv == "false" && this.delegateID.access.canAccInv == "true") {
        this.ta.CanAccInv = "true";
      }

      if (this.ta.CanAccPro == "false" && this.delegateID.access.canAccPro == "true") {
        this.ta.CanAccPro = "true";
      }

      if (this.ta.CanAccRep == "false" && this.delegateID.access.canAccRep == "true") {
        this.ta.CanAccRep = "true";
      }

      if (this.ta.CanAccVen == "false" && this.delegateID.access.canAccVen == "true") {
        this.ta.CanAccVen = "true";
      }

      if (this.ta.CanAppVen == "false" && this.delegateID.access.canAppVen == "true") {
        this.ta.CanAppVen = "true";
      }

      if (this.ta.CanDeleteVen == "false" && this.delegateID.access.canDeleteVen == "true") {
        this.ta.CanDeleteVen = "true";
      }

      if (this.ta.CanEditVen == "false" && this.delegateID.access.canEditVen == "true") {
        this.ta.CanEditVen = "true";
      }

      if (this.ta.CanViewFinPro == "false" && this.delegateID.access.canViewFinPro == "true") {
        this.ta.CanViewFinPro = "true";
      }

      if (this.ta.CanViewFlagPro == "false" && this.delegateID.access.canViewFlagPro == "true") {
        this.ta.CanViewFlagPro = "true";
      }

      if (this.ta.CanViewPenPro == "false" && this.delegateID.access.canViewPenPro == "true") {
        this.ta.CanViewPenPro = "true";
      }


    })
  }

  checkUser() {
    var existingUser = "No";
    setTimeout(() => {
      this.delegateUser = this.myControl.value;

      if (!this.delegateUser) {
        this.myControl.setValue(null);
        this.delegateUser = '';
      }
      else {
        this.options.forEach((element, i) => {
          if (element.username == this.myControl.value) {
            existingUser = "Yes"
          }
        })

        if (existingUser == "Yes") {
          this.getPosts(this.myControl.value)
        } else {
          this.myControl.setValue(null);
          this.delegateUser = '';
        }

      }
    }, 1000)
  }

  onFileUpload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onSubmit() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.doa.delegatingParty = this.myForm.get('DelegatingName')?.value;
    this.dataService.EditDelegationValidation(this.myForm.get('DelegatingName')?.value).subscribe({
      next: (vResult) => {
        if (vResult == null) {
          var name = "" + this.doa.delegatingParty;



          if (this.files[0] == "") {
            this.doa.delegationStatus_ID = 1;

            let startDate: any
            startDate = new DatePipe('en-ZA');
            this.doa.from_Date = startDate.transform(this.myForm.get('start')?.value, 'MMM d, y, h:mm:ss a');

            let endDate: any
            endDate = new DatePipe('en-ZA');
            this.doa.to_Date = startDate.transform(this.myForm.get('end')?.value, 'MMM d, y, h:mm:ss a');

            this.dataService.EditDelegation(this.doa, this.delID).subscribe({
              next: (response) => {
                this.dataService.EditTempAcc(this.ta, this.delID).subscribe({
                  next: (res) => {
                    this.dataService.CheckDelegation().subscribe({
                      next: (r) => {
                        if (r) {
                          document.getElementById('AnimationBtn').classList.toggle("is_active");
                          document.getElementById('cBtn').style.display = "none";
                          this.log.action = "Edited Delegation for Request: " + this.delID;
                          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                          let test: any
                          test = new DatePipe('en-ZA');
                          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                          this.dataService.AuditLogAdd(this.log).subscribe({
                            next: (Log) => {
                              var action = "EDIT";
                              var title = "EDIT SUCCESSFUL";
                              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + this.delID + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                                disableClose: true,
                                data: { action, title, message }
                              });

                              const duration = 1750;
                              setTimeout(() => {
                                this.router.navigate(['/Delegation'], { queryParams: { refresh: true } });
                                dialogRef.close();
                              }, duration);
                            }
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          } else {

            this.fileToUpload = this.files[0];

            if (this.fileToUpload != null) {

              let sFile = this.doa.delegation_Document;
              let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
              let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

              this.dataService.DeleteDelegationFile(DelegateName, filename).subscribe(r => {
                let DelegateName: string = name

                let file: File = this.fileToUpload

                this.dataService.DelegateFileAdd(DelegateName, file).subscribe(response => {
                  let Path: any = response
                  this.sPath = Path.pathSaved.toString()
                  this.doa.delegation_Document = this.sPath;
                  this.doa.delegationStatus_ID = 1;

                  let startDate: any
                  startDate = new DatePipe('en-ZA');
                  this.doa.from_Date = startDate.transform(this.myForm.get('start')?.value, 'MMM d, y, h:mm:ss a');

                  let endDate: any
                  endDate = new DatePipe('en-ZA');
                  this.doa.to_Date = startDate.transform(this.myForm.get('end')?.value, 'MMM d, y, h:mm:ss a');

                  this.dataService.EditDelegation(this.doa, this.delID).subscribe({
                    next: (response) => {
                      this.dataService.CheckDelegation().subscribe({
                        next: (r) => {
                          if (r) {
                            document.getElementById('AnimationBtn').classList.toggle("is_active");
                            document.getElementById('cBtn').style.display = "none";
                            this.log.action = "Edited Delegation for Request: " + this.delID;
                            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                            let test: any
                            test = new DatePipe('en-ZA');
                            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                            this.dataService.AuditLogAdd(this.log).subscribe({
                              next: (Log) => {
                                var action = "EDIT";
                                var title = "EDIT SUCCESSFUL";
                                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + this.delID + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                                  disableClose: true,
                                  data: { action, title, message }
                                });

                                const duration = 1750;
                                setTimeout(() => {
                                  this.router.navigate(['/Delegation'], { queryParams: { refresh: true } });
                                  dialogRef.close();
                                }, duration);
                              }
                            })


                          }
                        }
                      })
                    }
                  })
                })
              })


            }
          }
        }
        else {
          document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
          var action = "ERROR";
          var title = "ERROR: Delegation Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exists a Active or Inactive <strong style='color:red'> DELEGATION REQUEST </strong> for user <strong>" + this.doa.delegatingParty + " <strong style='color:red'>!</strong>");

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


  openEditDelegationTab(): void {
    const userManualUrl = 'assets/PDF/EditDelegationUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
