import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Role } from 'src/app/Shared/EmployeeRole';
import { User } from 'src/app/Shared/User';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { HttpClient } from '@angular/common/http';
import { SoleSupplier } from 'src/app/Shared/Sole_Supplier';
import { Onboard_Status } from 'src/app/Shared/OnboardStatus';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { interval, take } from 'rxjs';
import { Notification } from 'src/app/Shared/Notification';
import { DatePipe } from '@angular/common';
import { Notification_Type } from 'src/app/Shared/Notification_Type';
@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit {

  VStatus: VendorStatus = {
    vendor_Status_ID: 0,
    name: '',
    description: '',
  }

  Vendor: VendorOnboardRequest = {
    vendor_ID: 0,
    vendor_Status_ID: 0,
    vendor_Status: this.VStatus,
    name: '',
    email: '',
    number_Of_Times_Used: 0,
    sole_Supplier_Provided: false,
    preferedVendor: false,
  }

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

  OnboardStatus: Onboard_Status = {
    status_ID: 1,
    name: "",
    description: "",
  }

  Onboard_Request: OnboardRequest = {
    onboard_Request_Id: 0,
    user_Id: 1,
    vendor_ID: 0,
    status_ID: 1,
    vendor: { vendor_ID: 0, vendor_Status_ID: 0, vendor_Status: this.VStatus, name: '', email: '', number_Of_Times_Used: 0, sole_Supplier_Provided: false, preferedVendor: false },
    onboard_Status: this.OnboardStatus,
    users: { user_Id: 0, role_ID: 0, username: '', password: '', profile_Picture: './assets/Images/Default_Profile.jpg', no_Notifications: 0, role: this.rl },
    quotes: '',
  }

  SoleSupply: SoleSupplier = {
    sole_Supplier_ID: 0,
    vendor_ID: 0,
    vendor: this.Vendor,
    mD_Approval: false,
    date: new Date(),
    reason: "",
  }

  Notification_Type: Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }

  VendorNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };

  SoleSupplierFormGroup = this._formBuilder.group({
    CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
    Reason: ['', [Validators.required, Validators.maxLength(32)]],
    CompanyQuote: ''
  })
  rows: FormArray = this._formBuilder.array([]);
  CompanyContactInfoFormGroup: FormGroup = this._formBuilder.group({ 'RequestData': this.rows });
  fileToUpload: File | null = null;
  files: any[] = ['', '', ''];

  selectedOption: string = "true";
  matcher = new MyErrorStateMatcher()

  constructor(private _formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private http: HttpClient, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  addTab() {
    const row = this._formBuilder.group({
      tab: [this.rows.length + 1],
      CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CompanyQuote: ['', Validators.required],
      PrefferedVendor: [false],
    });
    this.rows.push(row);
    this.files.push('');
  }
  selectedIndex = 0;
  removeTab(index: number) {

    this.rows.removeAt(index);
    this.selectedIndex = index - 1;
  }

  ngOnInit() {
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    //console.log(User)
    //console.log(User.unique_name)
    this.dataService.GetUserByUsername(User).subscribe(response => {
      this.usr = response;
    })

    for (let i = 1; i < 4; i++) {
      const row = this._formBuilder.group({
        tab: [i],
        CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
        CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        CompanyQuote: ['', Validators.required],
        PrefferedVendor: [false],
      });
      this.rows.push(row);

    }

  }

  radioButtonChange(Supplier: MatRadioChange) {
    this.selectedOption = Supplier.value

  }
  //  : { target: { files: (File | null)[]; }; }
  onFileUpload(i: number, event: any) {
    this.fileToUpload = event.target.files[0];
    //this.fileToUpload?.name

    // console.log(this.fileToUpload)
    if (this.fileToUpload != null) {
      for (let a = 0; a < (i + 1); a++) {
        if (a == i) {
          this.files[a] = this.fileToUpload;
        }
      }
    }
  }

  Passed: boolean = true
  PassedSecVal: boolean = true
  Validate() {
    this.Passed = true;
    this.PassedSecVal = true;
    let sCompanyName = "";
    for (let a = 0; a < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; a++) {
      //this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;

      for (let b = 0; b < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; b++) {
        if (this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyName == this.CompanyContactInfoFormGroup.controls.RequestData.value[b].CompanyName && a != b) {
          this.Passed = false;

        }
        else if (this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyEmail == this.CompanyContactInfoFormGroup.controls.RequestData.value[b].CompanyEmail && a != b) {
          this.Passed = false;

        }
        else if (this.files[a].name != "" && this.files[a].name == this.files[b].name && this.files[a].size == 0 && a != b) {
          this.Passed = false;
        }
      }
      this.dataService.GetVendorValidation(this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyName).subscribe({
        next:
          (Result) => {
            if (Result != null) {
              this.PassedSecVal == false;
              sCompanyName = this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyName;
            }
          }
      })
    }

    if (this.Passed == false) {
      var action = "ERROR";
      var title = "VALIDATION ERROR";
      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Please ensure that no information is <strong> duplicated</strong> and contains <strong>value</strong>.");

      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
        disableClose: true,
        data: { action, title, message }
      });

      const duration = 1750;
      setTimeout(() => {
        //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
        dialogRef.close();
      }, duration);
    }
    else if (this.Passed == true) {
      if (this.PassedSecVal != true) {
        var action = "ERROR";
        var title = "VALIDATION ERROR";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an approved vendor with the name <strong>" + sCompanyName + "</strong>.");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 2000;
        setTimeout(() => {
          //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
          dialogRef.close();
        }, duration);
      }
      else {
        this.AddRequest()
      }

    }
  }

  SoleSupplierValidation() {
    this.dataService.GetVendorValidation(this.SoleSupplierFormGroup.get("CompanyName")?.value).subscribe({
      next:
        (Result) => {
          if (Result != null) {
            this.Passed == false;
            var action = "ERROR";
            var title = "VALIDATION ERROR";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an approved vendor with the name <strong>" + this.SoleSupplierFormGroup.get("CompanyName")?.value + "</strong>.");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 2000;
            setTimeout(() => {
              //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
              dialogRef.close();
            }, duration);
          } else {
            this.AddRequest()
          }
        }
    })
  }





  sPath = "";
  AddRequest() {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let ReqNo = paramater.get("RequestNo");
        this.Onboard_Request.onboard_Request_Id = Number(ReqNo)

      }
    });
    // this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
    // this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
    // this.Vendor.vendor_Status_ID = 1;
    // this.Vendor.number_Of_Times_Used = 0;
    // this.Onboard_Request.vendor = this.Vendor;

    if (this.selectedOption == "true") {
      for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length + 1; i++) {

        console.log(i)
        //we going to need to check that it does not repeat the same file 

        this.fileToUpload = this.files[i]

        if (this.fileToUpload != null) {

          let RequestNo: string = "Request" + this.Onboard_Request.onboard_Request_Id

          let file: File = this.fileToUpload
          console.log(file)
          console.log(RequestNo)
          this.dataService.OnboardFileAdd(RequestNo, file).subscribe(response => {
            let Path: any = response
            this.sPath = Path.pathSaved.toString()
            this.Onboard_Request.quotes = this.sPath
            this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
            this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
            this.Vendor.preferedVendor = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].PrefferedVendor;
            this.Vendor.vendor_Status_ID = 1;
            this.Vendor.number_Of_Times_Used = 0;
            this.Onboard_Request.vendor = this.Vendor;
            this.Onboard_Request.onboard_Status = this.OnboardStatus;
            this.Onboard_Request.user_Id = Number(this.usr.user_Id);
            console.log(this.Onboard_Request)
            this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe({
              next: (response) => {
                if (i = this.CompanyContactInfoFormGroup.controls.RequestData.value.length) {
                  this.VendorNotification.notification_Type_ID = 1;
                  let transVar: any
                  transVar = new DatePipe('en-ZA');
                  this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
                  this.VendorNotification.name = "Request #" + response[0].onboard_Request_Id + " has been created";
                  this.VendorNotification.user_ID = 1;
                  this.dataService.VendorAddNotification(this.VendorNotification).subscribe();
                }

                console.log(response);
                var action = "CREATE";
                var title = "CREATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response[0].onboard_Request_Id + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/request-view']);
                  this.dialog.afterAllClosed.subscribe({
                    next: (response) => {

                      this.ngOnInit();
                    }
                  })
                  dialogRef.close();
                }, duration);
              }
            }
            );//dataservice

          });//post

        }//if
      }//for loop
    }
    else if (this.selectedOption == "false") {
      this.fileToUpload = this.files[0]
      this.Vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value
      this.Vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value
      this.Vendor.vendor_Status_ID = 1;
      this.Vendor.number_Of_Times_Used = 0;
      this.Onboard_Request.vendor = this.Vendor;
      this.Onboard_Request.onboard_Status = this.OnboardStatus;
      this.Onboard_Request.vendor.sole_Supplier_Provided = true;
      this.SoleSupply.reason = this.SoleSupplierFormGroup.get("Reason")?.value
      if (this.files[0] != '') {
        let RequestNo = "Request" + this.Onboard_Request.onboard_Request_Id
        this.dataService.OnboardFileAdd(RequestNo, this.fileToUpload).subscribe(response => {
          let Path: any = response
          console.log(Path)
          this.sPath = Path.pathSaved.toString()
          this.Onboard_Request.quotes = this.sPath
          this.Onboard_Request.user_Id = Number(this.usr.user_Id);
          this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(response => {
            this.Onboard_Request = response[0]
            this.dataService.ChangeOnboardStatus(4, this.Onboard_Request.onboard_Request_Id, this.Onboard_Request.vendor_ID).subscribe()
            this.dataService.AddSoleSupplierDetails(this.Onboard_Request.vendor_ID, this.SoleSupply).subscribe({
              next: (response) => {
                this.VendorNotification.notification_Type_ID = 15;
                let transVar: any
                transVar = new DatePipe('en-ZA');
                this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
                this.VendorNotification.name = "Sole Supplier Addition Request for " + response[0].vendor.name;
                this.VendorNotification.user_ID = 1;
                this.dataService.VendorAddNotification(this.VendorNotification).subscribe();
                console.log(response);

                var action = "CREATE";
                var title = "CREATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + this.Onboard_Request.onboard_Request_Id + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.dialog.afterAllClosed.subscribe({
                    next: (response) => {
                      this.ngOnInit();
                    }
                  })
                  this.router.navigate(['/request-view']);
                  dialogRef.close();
                }, duration);
              }
            }

            )
          }
          );//dataservice

        });//post
      }//if
      else {
        this.Onboard_Request.vendor.sole_Supplier_Provided = true;
        this.Onboard_Request.quotes = "None"
        console.log(this.Onboard_Request)
        this.Onboard_Request.user_Id = Number(this.usr.user_Id);
        this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(response => {
          this.Onboard_Request = response[0]
          this.dataService.ChangeOnboardStatus(4, this.Onboard_Request.onboard_Request_Id, this.Onboard_Request.vendor_ID).subscribe(res => console.log(res))
          this.dataService.AddSoleSupplierDetails(this.Onboard_Request.vendor_ID, this.SoleSupply).subscribe({
            next: (response) => {
              this.VendorNotification.notification_Type_ID = 15;
              let transVar: any
              transVar = new DatePipe('en-ZA');
              this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
              this.VendorNotification.name = "Sole Supplier Addition Request for " + response[0].vendor.name;
              this.VendorNotification.user_ID = 1;
              this.dataService.VendorAddNotification(this.VendorNotification).subscribe();


              console.log(response);
              this.dataService.ChangeOnboardStatus(4, this.Onboard_Request.onboard_Request_Id, this.Onboard_Request.vendor_ID)
              var action = "CREATE";
              var title = "CREATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + this.Onboard_Request.onboard_Request_Id + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/request-view']);
                this.dialog.afterAllClosed.subscribe({
                  next: (response) => {
                    this.ngOnInit();
                  }
                })
                dialogRef.close();
              }, duration);
            }
          }

          )
        }
        );//dataservice
      }
      console.log("why")
    }
  }


  PreferredChecked = false;
  CheckPrev: any;
  onPreferredChecked(i: number) {

    if (this.CheckPrev != undefined && this.CheckPrev != i) {
      this.rows.controls[this.CheckPrev].get('PrefferedVendor')?.setValue(false);
    }

    this.CheckPrev = i

    if (this.PreferredChecked == false) {
      this.PreferredChecked = true;
      this.rows.controls[i].get('PrefferedVendor')?.setValue(this.PreferredChecked);
    }
    else {
      this.PreferredChecked = false;
    }



  }



}//addrequest 


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
