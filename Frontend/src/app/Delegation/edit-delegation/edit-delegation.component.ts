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

@Component({
  selector: 'app-edit-delegation',
  templateUrl: './edit-delegation.component.html',
  styleUrls: ['./edit-delegation.component.css']
})
export class EditDelegationComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  user: any
  admin: any;
  iName: string;
  delegation: any;
  delID: number;

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

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      DelegatingName: [''],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      DelegationFile: ['', [Validators.required]]
    })

    this.getDelegation();

    this.dataService.GetUsers().subscribe(r => {
      this.options = r
      this.options.forEach((element, i) => {
        if (element.username == this.doa.delegatingParty) this.options.splice(i, 1);
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

  getDelegation() {
    this.dataService.GetDelegation(+this.route.snapshot.params['did']).subscribe(r => {
      this.delegation = r;
      this.myForm.patchValue({
        DelegatingName: this.delegation.delegatingParty,
        start: this.delegation.from_Date,
        end: this.delegation.to_Date,
        DelegationFile: this.delegation.delegation_Document
      });
      
      this.delID = this.delegation.delegation_ID;
      this.doa.user_Id = this.delegation.user_Id;
      this.doa.admin_ID = this.delegation.admin_ID;
      this.doa.delegationStatus_ID = this.delegation.delegationStatus_ID;
      this.doa.from_Date = this.delegation.from_Date;
      this.doa.to_Date = this.delegation.to_Date;
      this.doa.delegation_Document = this.delegation.delegation_Document;
      this.doa.delegatingParty = this.delegation.delegatingParty;
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
    this.router.navigateByUrl('Delegation');
  }

  getPosts(username) {
    this.dataService.GetUserByUsername(username).subscribe(r => {
      this.delegateID = r;
      this.doa.user_Id = this.delegateID.user_Id;
    })
  }

  onFileUpload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onSubmit() {
    this.doa.delegatingParty = this.myForm.get('DelegatingName')?.value;
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

          this.dataService.CheckDelegation().subscribe({
            next: (r) => {
              if (r) {
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
                  }
                })
              }
            })
          })
        })

        
      } 
    }
    

    
  }
}
