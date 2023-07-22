import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
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
import { Temporary_Access } from '../../Shared/Temporary_Access';
import { User } from '../../Shared/User';

@Component({
  selector: 'app-create-delegation',
  templateUrl: './create-delegation.component.html',
  styleUrls: ['./create-delegation.component.css']
})
export class CreateDelegationComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  user: any
  admin: any;
  iName: string;

  myControl = new FormControl<string | User>('');
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

  usr: User = {
    user_Id: 0,
    role_ID: 0,
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
    description: '',
  }

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      DelegatingName: [''],
      DelegateName: [''],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      DelegationFile: ['', [Validators.required]]
    })

    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
    this.dataService.GetAdminByUsername(this.iName).subscribe(n => {
      this.admin = n;
      this.adm = this.admin;
      this.doa.admin = this.adm;
      this.doa.admin_ID = 0;
    })
    this.getUsername();

    this.dataService.GetUsers().subscribe(r => {
      this.options = r
      this.options.forEach((element, i) => {
        if (element.username == this.user.username) this.options.splice(i, 1);
      })
    })



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

  getUsername() {
    this.dataService.GetUser(+this.route.snapshot.params['uid']).subscribe(result => {
      this.user = result;
      this.myForm.patchValue({
        DelegatingName: this.user.username
      })
      this.ta.name = this.user.role.name;
      this.ta.description = this.user.role.description;
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
    this.router.navigateByUrl('ViewEmployee');
  }

  getPosts(username) {
    this.dataService.GetUserByUsername(username).subscribe(r => {
      this.delegateID = r;
      this.usr = this.delegateID;
      this.doa.user = this.usr;
      this.doa.user_Id = 0;
      //console.log(this.doa.user_Id)
    })
  }

  onFileUpload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onSubmit() {
    console.log(this.doa)
    this.doa.delegatingParty = this.myForm.get('DelegatingName')?.value;
    var name = "" + this.doa.delegatingParty;

    
    this.fileToUpload = this.files[0];

    if (this.fileToUpload != null) {
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

        //this.doa.from_Date = this.myForm.get('start')?.value;
        /*this.doa.to_Date = this.myForm.get('end')?.value;*/

        this.dataService.AddDelegation(this.doa).subscribe({
          next: (response) => {

            this.ta.delegation_ID = response[0].delegation_ID;
            this.dataService.AddTempAcc(this.ta).subscribe({
              next: (r) => {

                this.dataService.InitiatRecurringJobDelegation()
                this.dataService.CheckDelegation().subscribe({
                  next: (r) => {
                    if (r) {
                      var action = "CREATE";
                      var title = "CREATE SUCCESSFUL";
                      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response[0].delegation_ID + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

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
                  }
                })


                
 
              }
            })
          }
        })
      })
    }


    


    //this.adm.adminName = this.myForm.get('AdminName')?.value;
    //this.adm.adminSurname = this.myForm.get('AdminSurname')?.value;
    //this.adm.cellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    //this.adm.email = this.myForm.get('Email')?.value;

    //var cel = this.myForm.get('CellPhone_Num')?.value;
    //var name = this.myForm.get('AdminName')?.value;
    //var surname = this.myForm.get('AdminSurname')?.value;
    //var ts = name.concat(surname);
    //var username = ts.concat(cel.toString().substring(4, 7));
    //username = username.replace(/\s/g, "");

    //this.usr.username = username;
    //var id = this.usr.user_Id;

    ////this.dataService.EditUser(this.usr, this.route.snapshot.params['uid']).subscribe(r => {
    ////  this.dataService.EditAdmin(this.adm, this.route.snapshot.params['uid']).subscribe(result => {
    ////    this.router.navigateByUrl('ViewAdmin');
    ////  })
    ////})

    //this.dataService.EditUserValidation(username, id).subscribe({
    //  next: (Result) => {
    //    if (Result == null) {
    //      this.dataService.EditUser(this.usr, this.admin.user_Id).subscribe(result => {
    //        this.dataService.EditAdmin(this.adm, this.admin.admin_ID).subscribe({
    //          next: (response) => {
    //            document.getElementById('cBtn').style.display = "none";
    //            document.querySelector('button').classList.toggle("is_active");
    //            var action = "Update";
    //            var title = "UPDATE SUCCESSFUL";
    //            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The admin <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

    //            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
    //              disableClose: true,
    //              data: { action, title, message }
    //            });

    //            const duration = 1750;
    //            setTimeout(() => {
    //              this.router.navigate(['/ViewAdmin']);
    //              dialogRef.close();
    //            }, duration);
    //          }
    //        })
    //      })
    //    }
    //    else {
    //      var action = "ERROR";
    //      var title = "ERROR: User Exists";
    //      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The user <strong>" + username + " <strong style='color:red'>ALREADY EXISTS!</strong>");

    //      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
    //        disableClose: true,
    //        data: { action, title, message }
    //      });

    //      const duration = 1750;
    //      setTimeout(() => {
    //        dialogRef.close();
    //      }, duration);
    //    }
    //  }
    //})
  }
}
