import { Component, OnInit,AfterContentInit, ViewChild } from '@angular/core';
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
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Onboard_Status } from 'src/app/Shared/OnboardStatus';
import { SoleSupplier } from 'src/app/Shared/Sole_Supplier';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { AuditLog } from 'src/app/Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from 'src/app/Shared/Access';





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-request-update',
  templateUrl: './request-update.component.html',
  styleUrls: ['./request-update.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})



export class RequestUpdateComponent {
  
 

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
    sole_Supplier_Provided:false,
    preferedVendor:false,
  }

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

  OnboardStatus : Onboard_Status = {
    status_ID: 0,
    name: "",
    description: "",
  }

  Onboard_Request: OnboardRequest = {
    onboard_Request_Id: 0,
    user_Id: 1,
    vendor_ID: 0,
    status_ID:1,
    vendor: { vendor_ID: 0, vendor_Status_ID: 0, vendor_Status: this.VStatus, name: '', email: '', number_Of_Times_Used: 0,sole_Supplier_Provided:false,preferedVendor:false},
    onboard_Status: this.OnboardStatus,
    users: {
      user_Id: 0, role_ID: 0, access_ID: 0, username: '', password: '', profile_Picture: './assets/Images/Default_Profile.jpg', no_Notifications: 0, no_VenNotifications: 0, no_InvNotifications: 0, no_DelNotifications: 0, no_ProNotifications: 0, role: this.rl, access: this.Access },
    quotes: '',
  }

  SoleSupply: SoleSupplier = {
    sole_Supplier_ID: 0,
    vendor_ID: 0,
    vendor: this.Vendor,
    mD_Approval : false,
    date: new Date(),
    reason : "",
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  SoleSupplierFormGroup = this._formBuilder.group({
    CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
    Reason: ['', [Validators.required, Validators.maxLength(32)]],
    CompanyQuote: '',
  })
  rows: FormArray = this._formBuilder.array([]);
  CompanyContactInfoFormGroup: FormGroup = this._formBuilder.group({ 'RequestData': this.rows });

  fileToUpload: File | null = null;
  files: any[] = ['', '', ''];
 
  selectedOption: string = "True";
  matcher = new MyErrorStateMatcher()

  constructor(private _formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private http: HttpClient,private dialog: MatDialog, private sanitizer:DomSanitizer) { }

  addTab() {
    const row = this._formBuilder.group({
      tab: [this.rows.length + 1],
      CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CompanyQuote: ['',[Validators.required]],
      PreferedVendor: [false],
    });
    this.rows.push(row);
    this.files.push('');
  }
  //add delete dataservice
  removeTab(index: number) {
    
    if(this.rows.controls[index].get('PreferedVendor')?.value == true) {
      this.rows.controls[index].get('PreferedVendor')?.setValue(false);
      this.CheckPrev = undefined
    }

    this.rows.removeAt(index);
    this.selectedIndex = index-1; 

  }
 
  //redundant
  vendorsRequest: VendorOnboardRequest[] = [];
  onboardRequest: OnboardRequest[] = [];
  selectedIndex = 0;
  VendorType:boolean = true;
  FileDetails:any[] = [];
  
  ngOnInit() {
    
    const row = this._formBuilder.group({
      tab: [this.onboardRequest.length],
      CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
      CompanyQuote: '',
      PreferedVendor: [false],
    });
    this.rows.push(row);
    this.fileToUpload = this.files[0]


    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {

        var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
        this.dataService.GetUserByUsername(User).subscribe(response => {
          this.usr = response;
          this.usr.access = response.access
          this.Onboard_Request.users = response
          this.Onboard_Request.users.access = response.access
        })
        
        let RequestID = paramater.get("RequestNo");
        this.dataService.GetRequestByID(Number(RequestID)).subscribe(result => {
          let RequestList: any[] = result
          RequestList.forEach((element) => {

            this.onboardRequest.push(element)
            if(element.vendor.preferedVendor == true) {
              this.CheckPrev = this.onboardRequest.length-1;

            }
            const row = this._formBuilder.group({
              tab: [this.onboardRequest.length],
              CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
              CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
              CompanyQuote: '',
              PreferedVendor: [false],
            });
            this.rows.push(row);
            this.files.push('');
            this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
            
          })  
          this.rows.removeAt(1);
          //this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
        if(RequestList.length > 2) {
          for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
            this.FileDetails.push({FileURL:"",FileName:""})
            this.rows.controls[i].get('CompanyName')?.setValue(this.onboardRequest[i].vendor.name);
            this.rows.controls[i].get('CompanyEmail')?.setValue(this.onboardRequest[i].vendor.email);
            this.rows.controls[i].get('PreferedVendor')?.setValue(this.onboardRequest[i].vendor.preferedVendor);
            let sFile = this.onboardRequest[i].quotes;
            let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
              
              this.FileDetails[i].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
              this.FileDetails[i].FileName = filename;           
          }
         }
         else 
         {
          this.dataService.GetSoleSupplierByID(RequestList[0].vendor_ID).subscribe(result => {
            this.SoleSupply = result
            this.SoleSupplierFormGroup.get('Reason')?.setValue(this.SoleSupply.reason);

          })
          let sFile = this.onboardRequest[0].quotes;
          this.SoleSupplierFormGroup.get('CompanyName')?.setValue(this.onboardRequest[0].vendor.name);
          this.SoleSupplierFormGroup.get('CompanyEmail')?.setValue(this.onboardRequest[0].vendor.email);

          if(sFile != "None") {
            this.FileDetails.push({FileURL:"",FileName:""})
           
           
           let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
           let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            
            this.FileDetails[0].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
            this.FileDetails[0].FileName = filename;
          }
  
         }  
          
          if(RequestList.length < 2) {
            this.VendorType = false;
          }
          else {
            this.VendorType = true;
          }
          this.setActiveTab()
          
          
        })
      }
    });
}//ngOnInit

  setActiveTab() {
    this.selectedIndex = 0;

  }
  //should also be delete
  radioButtonChange(Supplier: MatRadioChange) {
    this.selectedOption = Supplier.value
  }
  //  : { target: { files: (File | null)[]; }; }
  Passed: boolean = true
  onFileUpload(i: number, event: any) {
    this.fileToUpload = event.target.files[0];
    //this.fileToUpload?.name

    if (this.fileToUpload != null) {
      for (let a = 0; a < (i + 1); a++) {
        if (a == i) {
          this.files[a] = this.fileToUpload;
        }
      }
    }
  }

  Validate() {
    this.Passed = true
    for (let a = 0; a < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; a++) { 
      //this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
    
      for (let b = 0; b < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; b++) { 
        if(this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyName == this.CompanyContactInfoFormGroup.controls.RequestData.value[b].CompanyName && a !=b) {
            this.Passed = false;

        }
        else if(this.CompanyContactInfoFormGroup.controls.RequestData.value[a].CompanyEmail == this.CompanyContactInfoFormGroup.controls.RequestData.value[b].CompanyEmail && a !=b) {
            this.Passed = false;
          
        }
        else if (this.files[a].name != "" && this.files[a].name == this.files[b].name && this.files[a].size == 0 && a !=b) {
          this.Passed = false;
        }
        
      }
      // this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
      // if()
    }

    if(this.Passed == false) {
      var action = "ERROR";
    var title = "VALIDATION ERROR";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Please ensure that no information is <strong> duplicated</strong> and contains <strong>value</strong>.");

    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
      disableClose: true,
      data: { action, title, message }
    });

    const duration = 5000;
    setTimeout(() => {
      //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
      dialogRef.close();
    }, duration);
    }
    else if(this.Passed == true) {
      this.AddRequest()
    }
  }



  sPath = "";
  AddRequest() {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let requestNo = paramater.get("RequestNo");
        this.Onboard_Request.onboard_Request_Id = Number(requestNo)
      }
    });

  if(this.VendorType == true) {
    for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
      if (this.files[i] != "" && this.onboardRequest[i] != undefined) {
        let sFile = this.onboardRequest[i].quotes;
        let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        this.dataService.DeleteFile(RequestNo,filename).subscribe!
    
        this.fileToUpload = this.files[i]

        RequestNo = "Request" + this.onboardRequest[0].onboard_Request_Id.toString();
        this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
          let Path: any = response
          this.sPath = Path.PathSaved.toString()
          this.Onboard_Request.quotes = this.sPath
          this.Vendor = this.onboardRequest[i].vendor
          this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Vendor.preferedVendor = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].PreferedVendor;
          this.Vendor.vendor_Status_ID = 1;
          this.Vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor = this.Vendor 
          this.Onboard_Request.users = this.onboardRequest[i].users
          this.Onboard_Request.user_Id = Number(this.onboardRequest[0].users.user_Id);

          this.dataService.UpdateOnboardRequest(this.onboardRequest[i].onboard_Request_Id,this.Onboard_Request).subscribe({
            next: (response) => {

              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response.onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");
    
              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });
    
              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
                
                dialogRef.close();
              }, duration);
            }}
          );//dataservice
//this.onboardRequest[i].vendor_ID, this.onboardRequest[i].vendor_ID,
        });//post
      }//if
      else {
        if (this.onboardRequest[i] != undefined) {

          
          this.Onboard_Request.quotes = this.onboardRequest[i].quotes
          this.Vendor = this.onboardRequest[i].vendor
          this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Vendor.preferedVendor = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].PreferedVendor;
          this.Vendor.vendor_Status_ID = 1;
          this.Vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor = this.Vendor;
          this.Onboard_Request.users = this.onboardRequest[i].users
          this.Onboard_Request.user_Id = Number(this.onboardRequest[0].users.user_Id);

          this.Onboard_Request.vendor.preferedVendor = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].PreferedVendor;

          this.dataService.UpdateOnboardRequest(this.onboardRequest[i].onboard_Request_Id,this.Onboard_Request).subscribe({
            next: (response) => {

              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response.onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");
    
              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });
    
              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/request-view']);
                
                dialogRef.close();
              }, duration);
            }});//dataservice
        }
        else {

          let RequestNo = "Request" + this.onboardRequest[0].onboard_Request_Id.toString()
          this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
          let Path: any = response
          
          this.sPath = Path.pathSaved.toString()
          this.Onboard_Request.quotes = this.sPath
          this.Onboard_Request.vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Onboard_Request.vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Onboard_Request.vendor.vendor_Status_ID = 1;
          this.Onboard_Request.vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor.vendor_ID = 0;
          this.Onboard_Request.users = this.onboardRequest[0].users
        this.Onboard_Request.user_Id = Number(this.onboardRequest[0].users.user_Id);
          this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe({
            next: (response) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response[0].onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");
    
              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });
    
              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/request-view']);
                
                dialogRef.close();
              }, duration);
            }});//dataservice

        });//post
        }//else end
        
      }
      
    }//for loop

    if(this.onboardRequest.length >  this.CompanyContactInfoFormGroup.controls.RequestData.value.length) {

      for (let i = this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i < this.onboardRequest.length; i++) {
        let sFile = this.onboardRequest[i].quotes;
        let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        this.dataService.DeleteFile(RequestNo,filename).subscribe!
        this.dataService.DeleteRequest(this.onboardRequest[i].onboard_Request_Id,this.onboardRequest[i].vendor_ID).subscribe({
          next: (response) => {
            if(this.onboardRequest.length == this.CompanyContactInfoFormGroup.controls.RequestData.value.length -1) {
              this.log.action = "Exported Inventory Details";
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + response[0].onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/request-view']);
                    dialogRef.close();
                  }, duration);
                }
              })
            }
            
          }})

      }
  
    }
  }
  else 
  if(this.VendorType == false) {
    //this.onboardRequest[0].users.role = this.rl;
    this.onboardRequest[0].vendor.vendor_Status = this.VStatus
    //this.onboardRequest[0].user_Id = 1

    this.fileToUpload = this.files[0]
    this.Vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value 
    this.Vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value 
    this.Vendor.vendor_Status_ID = 1;
    this.Vendor.number_Of_Times_Used = 0;
   // this.Onboard_Request.vendor = this.Vendor;
    this.Onboard_Request.vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value ;
    this.Onboard_Request.vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value;
    this.Onboard_Request.vendor.sole_Supplier_Provided = true;
    this.Onboard_Request.onboard_Status = this.OnboardStatus;
    
    this.SoleSupply.reason = this.SoleSupplierFormGroup.get("Reason")?.value
    this.Onboard_Request = this.onboardRequest[0]
    if (this.files[0] != '') {
      if(this.Onboard_Request.quotes != "None") {
        let sFile = this.onboardRequest[0].quotes;
        let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        this.dataService.DeleteFile(RequestNo,filename).subscribe();

      }
   
      
      let RequestNo = "Request" + this.Onboard_Request.onboard_Request_Id 
      this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
        let Path: any = response

        this.sPath = Path.pathSaved.toString()
        this.Onboard_Request.quotes = this.sPath
        this.Onboard_Request.vendor.sole_Supplier_Provided = true;
        this.Onboard_Request.users = this.onboardRequest[0].users
        this.Onboard_Request.user_Id = Number(this.onboardRequest[0].users.user_Id);
        this.dataService.UpdateOnboardRequest(this.Onboard_Request.onboard_Request_Id ,this.Onboard_Request).subscribe(
          (RequestAdded) => {
            this.SoleSupply.vendor_ID = RequestAdded.vendor_ID
            this.dataService.UpdateSoleSupplier(RequestAdded.vendor_ID,this.SoleSupply).subscribe({
              next: (response) => {
                var action = "Update";
                    var title = "UPDATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + RequestAdded.onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      this.router.navigate(['/request-view']);
                      dialogRef.close();
                    }, duration);     
              }});
          }//response
        );//dataservice
      });//post
    }//if
    else {
     this.Onboard_Request.vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value ;
     this.Onboard_Request.vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value;

     // this.SoleSupply.vendor = this.Onboard_Request.vendor  
     this.Onboard_Request.users = this.onboardRequest[0].users
     this.Onboard_Request.user_Id = Number(this.onboardRequest[0].users.user_Id);
      this.Onboard_Request.quotes = this.onboardRequest[0].quotes 
        this.dataService.UpdateOnboardRequest(this.onboardRequest[0].onboard_Request_Id, this.Onboard_Request).subscribe(
          (RequestAdded) => {

            this.SoleSupply.vendor_ID = this.Onboard_Request.vendor_ID
            this.SoleSupply.vendor = RequestAdded.vendor
            this.dataService.UpdateSoleSupplier(RequestAdded.vendor_ID,this.SoleSupply).subscribe({
              next: (response) => {
                var action = "Update";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + RequestAdded.onboard_Request_Id + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/request-view']);

                  dialogRef.close();
                }, duration);
               
                
              }});
          }//response
        );//dataservice
    }
  }//if

  this.log.action = "Updated Onboard Request # " + this.onboardRequest[0].onboard_Request_Id;
  this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
  let test: any
  test = new DatePipe('en-ZA');
  this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
  this.dataService.AuditLogAdd(this.log).subscribe({
    next: (Log) => {
      
    }
  })
  

  }//function


PreferredChecked = false;
CheckPrev:any;
onPreferredChecked(i: number) {

  if ((this.CheckPrev != undefined) && (this.CheckPrev != i) && (this.rows.controls[this.CheckPrev].get('PreferedVendor').value != undefined)) {

    this.rows.controls[this.CheckPrev].get('PreferedVendor')?.setValue(false);
  }

  this.CheckPrev = i

  if (this.PreferredChecked == false) {
    this.PreferredChecked = true;
    this.rows.controls[i].get('PreferedVendor')?.setValue(this.PreferredChecked);
  }
  else {
    this.PreferredChecked = false;
  }



}






openEditOnboardRequestTab(): void {
  const userManualUrl = 'assets/PDF/EditOnboardUM.pdf'; 
  window.open(userManualUrl, '_blank');
}
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
