import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions, FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { DatePipe, NgFor } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VendorOnboardRequest } from '../Shared/VendorOnboardRequest';
import { Notification } from '../Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { User } from '../Shared/User';
import { Role } from '../Shared/EmployeeRole';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Ionic storage for session management
import { RefreshService } from '../Refresh/refresh.service';

@Component({
  selector: 'app-create-procurement-request',
  templateUrl: './create-procurement-request.page.html',
  styleUrls: ['./create-procurement-request.page.scss'],
})
export class CreateProcurementRequestPage implements OnInit {
  myForm: FormGroup = new FormGroup({});
  vendors: any[] = [];
  VendorType: String = 'Approved';

  VendorNameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]);
  filteredVendors: Observable<VendorOnboardRequest[]>

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private sanitizer: DomSanitizer, public alertController: AlertController, private navController: NavController, private storage: Storage, private refreshService: RefreshService) { this.init() }
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

  Procurement_Request: Procurement_Request = {
    procurement_Request_ID: 0,
    vendor_ID: 0,
    vendor: {
      vendor_ID: 0,
      vendor_Status_ID: 0,
      vendor_Status: {
        vendor_Status_ID: 0,
        name: "",
        description: ""
      },
      name: "",
      email: "",
      number_Of_Times_Used: 0,
      sole_Supplier_Provided: false,
      preferedVendor: true
    },
    requisition_Status_ID: 0,
    requisition_Status: {
      requisition_Status_ID: 0,
      name: "Approval Required",
      description: ""
    },
    user_ID: 0,
    user: {
      user_Id: 0,
      role_ID: 0,
      access_ID: 0,
      access: this.Access,
      username: "",
      password: "",
      profile_Picture: "",
      no_Notifications: 0,
      no_VenNotifications: 0,
      no_InvNotifications: 0,
      no_DelNotifications: 0,
      no_ProNotifications: 0,
      role: {
        role_ID: 0,
        name: "",
        description: ""
      }
    },
    name: "",
    description: ""
  }

  Procurement_Request_Quote: Procurement_Request_Quote = {
    quote_ID: 0,
    procurement_Request_ID: 0,
    procurement_Request: this.Procurement_Request,
    path: "",
    upload_Date: new Date(),
    prefferedQuote: false
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
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

  Notification_Type: Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }


  ProcurementNotif: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  }

  fileToUpload: File | null = null;
  files: File[] = [null, null, null];
  ProcurementQuotes: Procurement_Request_Quote[] = [null, null, null]
  FinalisedProcurementQuotes: Procurement_Request_Quote[] = []
  sPath = "";
  uploadedPathArray: any[] = []

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  originalBorderColor: string = 'solid #244688';
  userDepartment: any;
  vendorType: string = 'Approved';  // Default to 'Approved'
  async init() {
    await this.storage.create();
  }
  ngOnInit() {

    this.GetVendors();
    if (this.VendorType == "Approved") {
      this.myForm = this.formBuilder.group({
        Selection: ["Approved", [Validators.required]],
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        Vendor: [0, [Validators.required]],
        Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Quote1: ['', [Validators.required]]
      })
      this.getUser();
    }

    else {
      this.myForm = this.formBuilder.group({
        OtherSelection: ["Other", [Validators.required]],
        RequestName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        VendorName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        OtherDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        OtherQuote1: ['', [Validators.required]],
        OtherQuote2: ['', [Validators.required]],
        OtherQuote3: ['', [Validators.required]]
      })


      this.filteredVendors = this.VendorNameControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      )
    }

  }

  async getUser() {
    let token = await this.storage.get("token");
    let usr = this.dataService.decodeUser(token);
    this.userDepartment = this.dataService.decodeUserDep(token);

    this.dataService.GetUserByUsername(usr).subscribe({
      next: (Res) => {
        this.rl = Res.role;
        this.Access = Res.access;
        this.usr = Res;
        this.usr.access = this.Access;
        this.usr.role = this.rl;
      }
    })

  }

  private _filter(value: string): VendorOnboardRequest[] {
    const filterValue = value.toLowerCase();
    const filteredVendors = this.vendors.filter(option => option.name.toLowerCase().includes(filterValue) && option.vendor_Status.name == "other");

    this.setVal(value)
    // If no vendors match the filter, return an array with a single element containing the entered value
    return this.vendors.filter(option => option.name.toLowerCase().includes(filterValue) && option.vendor_Status.name == "Other");
  }

  setVal(Name: String) {
    this.myForm.get("VendorName").setValue(Name)
  }

  onFile1UploadApproved(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onFile1Upload(event: any) {
    document.getElementById("file1").style.border = this.originalBorderColor;
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
      if (this.files[0].name == this.files[1].name || this.files[0].name == this.files[2].name) {
        document.getElementById("file1").style.border = "solid red";
        this.files[0] = null;
        this.myForm.get("OtherQuote1").reset();
      }
      else {
        this.files[0] = this.fileToUpload;
        document.getElementById("file1").style.border = this.originalBorderColor;
      }
    }
  }

  onFile2Upload(event: any) {
    document.getElementById("file2").style.border = this.originalBorderColor;
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[1] = this.fileToUpload;
      if (this.files[1].name == this.files[0].name || this.files[1].name == this.files[2].name) {
        document.getElementById("file2").style.border = "solid red";
        this.files[1] = null;
        this.myForm.get("OtherQuote2").reset();
      }
      else {
        this.files[1] = this.fileToUpload;
        document.getElementById("file2").style.border = this.originalBorderColor;
      }
    }
  }

  onFile3Upload(event: any) {
    document.getElementById("file3").style.border = this.originalBorderColor;
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[2] = this.fileToUpload;
      if (this.files[2].name == this.files[0].name || this.files[2].name == this.files[1].name) {
        document.getElementById("file3").style.border = "solid red";
        this.files[2] = null;
        this.myForm.get("OtherQuote3").reset();
      }
      else {
        this.files[2] = this.fileToUpload;
        document.getElementById("file3").style.border = this.originalBorderColor;
      }
    }
  }
  setVendorType() {
    this.vendors.splice(0, this.vendors.length);
    this.myForm.reset()
    this.ngOnInit();
  }


  GetVendors() {
    if (this.VendorType == "Approved") {
      this.dataService.getAllApprovedVendors(3).subscribe({
        next: (response) => {
          this.vendors.splice(0, this.vendors.length);
          let VendorList: any[] = response
          VendorList.forEach((element) => {
            this.vendors.push(element)
          })
        }
      })
    }

    else {
      this.dataService.getAllOtherVendors(6).subscribe({
        next: (Response) => {
          this.vendors.splice(0, this.vendors.length);
          let VendorList: any[] = Response
          VendorList.forEach((element) => {
            this.vendors.push(element)
          })
        }
      })
    }

  }

  OnCancel() {
    this.navController.navigateForward('/tabs/ViewProcurementRequest');

  }

  async DisplayNotif() {
    this.log.action = "Created Procurement Request For: " + this.Procurement_Request.name;
    const token = await this.storage.get("token");
    this.log.user = this.dataService.decodeUser(token);
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');

    this.dataService.AuditLogAdd(this.log).subscribe({
      next: async (Result) => {
        const action = "CREATE";
        const title = "CREATE SUCCESSFUL";
        const message = "The procurement request for " + this.Procurement_Request.name + " has been ADDED successfully!";

        // Create the Ionic alert
        const alert = await this.alertController.create({
          header: title,
          subHeader: action,
          message: message,
          buttons: ['OK']
        });

        // Present the alert
        await alert.present();

        const duration = 1750;
        setTimeout(() => {
          // Dismiss the alert
          alert.dismiss();
          // Navigate to the new route
          this.refreshService.triggerRefresh();
          this.navController.navigateForward(['/tabs/ViewProcurementRequest']);
        }, duration);
      }
    });
  }

  AddQuote() {
    this.dataService.AddProcurementRequestQuote(this.ProcurementQuotes[0]).subscribe({
      next: (result1) => {
        if (result1) {
          this.dataService.AddProcurementRequestQuote(this.ProcurementQuotes[1]).subscribe({
            next: (Result2) => {
              if (Result2) {
                this.dataService.AddProcurementRequestQuote(this.ProcurementQuotes[2]).subscribe({
                  next: (Result3) => {
                    if (Result3) {
                      this.ProcurementNotif.notification_Type_ID = 18;
                      let transVar: any
                      transVar = new DatePipe('en-ZA');
                      this.ProcurementNotif.send_Date = transVar.transform(new Date(), 'MM d, y, h:mm:ss a');
                      this.ProcurementNotif.name = "A new procurement request for Vendor: " + this.Procurement_Request.vendor.name + " is awaiting your attention!";
                      this.dataService.GetEmployeeByDepartment(this.userDepartment).subscribe(ud => {
                        this.ProcurementNotif.user_ID = ud.user_Id;
                        this.dataService.ProcurementRequestAddNotification(this.ProcurementNotif).subscribe({
                          next: (Notif) => {
                            this.DisplayNotif()
                          }
                        })
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  async AddProcurementRequestA() {
    // document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;
    this.Procurement_Request.vendor.name = this.myForm.get("Vendor").value;

    const token = await this.storage.get("token");
    this.Procurement_Request.user.username = this.dataService.decodeUser(token);


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: async (response) => {
        if (response != null) {
          let file: File = this.fileToUpload;
          this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, "RequestID" + this.Procurement_Request.procurement_Request_ID.toString(), file).subscribe({
            next: (Response) => {

              let qPath = Response
              this.Procurement_Request = response[0]
              this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
              this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
              this.Procurement_Request_Quote.prefferedQuote = true;

              let test: any
              test = new DatePipe('en-ZA');
              this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');


              this.dataService.AddProcurementRequestQuote(this.Procurement_Request_Quote).subscribe({
                next: (result) => {
                  this.ProcurementNotif.notification_Type_ID = 18;
                  let transVar: any
                  transVar = new DatePipe('en-ZA');
                  this.ProcurementNotif.send_Date = transVar.transform(new Date(), 'MM d, y, h:mm:ss a');
                  this.ProcurementNotif.name = "A new procurement request for Vendor: " + this.Procurement_Request.vendor.name + " is awaiting your attention!";
                  this.dataService.GetEmployeeByDepartment(this.userDepartment).subscribe(ud => {
                    this.ProcurementNotif.user_ID = ud.user_Id;

                    this.dataService.ProcurementRequestAddNotification(this.ProcurementNotif).subscribe({
                      next: (Notif) => {
                        // document.getElementById('AnimationBtn').classList.toggle("is_active");
                        // document.getElementById('cBtn').style.display = "none";
                        this.DisplayNotif()
                      }
                    })
                  })

                }
              })
            }
          })
        }
        else {
          // document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
          const alert = await this.alertController.create({
            header: 'LIMIT EXCEEDED',
            subHeader: 'CREATE',
            message: `The Vendor: ${this.Procurement_Request.vendor.name} will need to be ONBOARDED in order to make this request!`,
            buttons: ['OK']
          });

          await alert.present();

          setTimeout(() => {
            alert.dismiss();
            this.myForm.reset();
            this.ngOnInit();
          }, 1750);

        }
      }
    })
  }
  async AddProcurementRequestB() {
    // document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.Procurement_Request.name = this.myForm.get("RequestName").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    this.Procurement_Request.vendor.name = this.myForm.get("VendorName").value;
    this.Procurement_Request.vendor.email = this.myForm.get("Email").value;
    this.Procurement_Request.user = this.usr;

    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: async (response) => {
        this.Procurement_Request = response[0]
        if (response != null) {
          for (let i = 0; i <= this.files.length - 1; i++) {
            if (this.files[i] != null) {
              let file: File = this.files[i]
              this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, ("RequestID" + this.Procurement_Request.procurement_Request_ID).toString(), file).subscribe({
                next: (Response) => {
                  this.uploadedPathArray.push(Response.pathSaved.toString())
                  this.GetQuoteDetails()
                }
              })
            }
          }
        }

        else {
          const alert = await this.alertController.create({
            header: 'CREATE UNSUCCESSFUL',
            subHeader: 'CREATE',
            message: `The procurement request for ${this.Procurement_Request.name}has FAILED`,
            buttons: ['OK']
          });

          // Present the alert
          await alert.present();

          // Close the alert and navigate
          setTimeout(() => {
            alert.dismiss();
            this.navController.navigateForward(['/tabs/ViewProcurementRequest']);
          }, 1750);
        }
      }
    })
  }

  GetQuoteDetails() {
    if (this.uploadedPathArray.length === this.files.length) {
      for (let a = 0; a <= this.files.length - 1; a++) {

        this.Procurement_Request_Quote = {
          quote_ID: 0,
          procurement_Request_ID: 0,
          procurement_Request: this.Procurement_Request,
          path: "",
          upload_Date: new Date(),
          prefferedQuote: false
        }

        //Get file name
        let Filename = this.files[a].name.toString()
        let VendorName = this.Procurement_Request.vendor.name.toString()
        let RequestID = ("RequestID" + this.Procurement_Request.procurement_Request_ID).toString()
        let PathName = (VendorName + "\\" + RequestID + "\\" + Filename).toString()
        //evaluate against path array
        let UploadedPath = this.uploadedPathArray.find(x => x === PathName)
        //store
        this.Procurement_Request_Quote.procurement_Request.name = this.myForm.get("RequestName").value;
        this.Procurement_Request_Quote.path = UploadedPath
        let test: any
        test = new DatePipe('en-ZA');
        this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');

        if (a == 0) {

          this.Procurement_Request_Quote.prefferedQuote = true
          this.ProcurementQuotes[a] = this.Procurement_Request_Quote
        }
        else if (a > 0) {

          this.Procurement_Request_Quote.prefferedQuote = false
          this.ProcurementQuotes[a] = this.Procurement_Request_Quote

        }
      }
      this.AddQuote()
    }
    else {
      //Do Nothing
    }


  }

}
