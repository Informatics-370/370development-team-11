import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions, FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
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
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RefreshService } from '../Refresh/refresh.service';

@Component({
  selector: 'app-edit-procurement-request',
  templateUrl: './edit-procurement-request.page.html',
  styleUrls: ['./edit-procurement-request.page.scss'],
})

export class EditProcurementRequestPage implements OnInit {
  myForm: FormGroup = new FormGroup({});
  vendors: any[] = [];
  VendorType: String;

  VendorNameControl = new FormControl('');
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private ActRoute: ActivatedRoute, public alertController: AlertController, private navController: NavController, private storage: Storage, private refreshService: RefreshService) { this.init() }

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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  Procurement_Request_Quote: Procurement_Request_Quote = {
    quote_ID: 0,
    procurement_Request_ID: 0,
    procurement_Request: this.Procurement_Request,
    path: "",
    upload_Date: new Date(),
    prefferedQuote: false
  }

  fileToUpload: File | null = null;
  files: File[] = [null, null, null];
  sPath = "";

  ProcurementQuotes: Procurement_Request_Quote[] = []
  FileDetails: any[] = [];
  originalBorderColor: string = 'solid #244688';


  ngOnInit() {
    this.ActRoute.paramMap.subscribe({
      next: async (paramater) => {
        const token = await this.storage.get("token");
        let usr = this.dataService.decodeUser(token);
        const id = paramater.get("id");
        this.VendorType = paramater.get("name");

        if (id) {
          this.dataService.GetPRRequestByID(Number(id)).subscribe({
            next: (RequestRecieved) => {
              this.Procurement_Request = RequestRecieved
              if (this.VendorType == "Other") {
                this.buildFormOther()
              }

              else {
                this.BuildFormApproved()
              }
            }
          })

          this.dataService.GetProcurementQuotesbyID(Number(id)).subscribe({
            next: (response) => {
              this.ProcurementQuotes = response;
              this.GetPRQuotes()
            }
          })
        }
      }
    })
  }
  async init() {
    await this.storage.create();
  }

  buildFormOther() {
    this.myForm = this.formBuilder.group({
      RequestName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      VendorName: ['', []],
      OtherDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      Email: ['', []],
      OtherQuote1: ['', []],
      OtherQuote2: ['', []],
      OtherQuote3: ['', []]
    })
  }

  BuildFormApproved() {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Vendor: ["", []],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      Quote1: ['', []]
    })
  }

  GetPRQuotes() {
    for (let i = 0; i < this.ProcurementQuotes.length; i++) {
      this.FileDetails.push({ FileURL: "", FileName: "" })
      let sFile = this.ProcurementQuotes[i].path;

      if (sFile != "None") {
        let VendorName = sFile.substring(0, sFile.indexOf("\\"))
        let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
        let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

        this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${RequestID}/${filename}`
        this.FileDetails[i].FileName = filename
      }
      else {
        this.FileDetails[i].FileURL = ""
        this.FileDetails[i].FileName = sFile;
      }
    }
  }
  onFileAppUpload(event: any) {
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

  functionNames = ['onFile1Upload', 'onFile2Upload', 'onFile3Upload'];

  onFileUpload(index: number, event: any) {
    const functionName = this.functionNames[index]; // Adjust index for zero-based array
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Call the appropriate function
    }
  }

  async DisplayNotif() {
    this.log.action = "Edited Procurement Request For: " + this.Procurement_Request.name;
    const token = await this.storage.get("token");
    this.log.user = this.dataService.decodeUser(token);
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');

    this.dataService.AuditLogAdd(this.log).subscribe({
      next: async (Result) => {
        const action = "UPDATE";
        const title = "UPDATE SUCCESSFUL";
        const message = "The procurement request for " + this.Procurement_Request.name + " has been updated successfully!";

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

  EditProcurementRequestA() {
    // document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;


    this.dataService.UpdatPRRequest(this.Procurement_Request.procurement_Request_ID, this.Procurement_Request).subscribe({
      next: (response) => {
        if (this.files[0] != null) {
          this.ProcurementQuotes.forEach(element => {
            let sFile = element.path;;
            let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
            let VendorName = Stringtouse.substring(0, (Stringtouse.indexOf("/")))
            let RequestID = Stringtouse.substring(Stringtouse.indexOf("/") + 1, (Stringtouse.lastIndexOf("/")))
            let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
            let file: File = this.fileToUpload;
            this.dataService.DeleteProcurementRequestFiles(VendorName, RequestID, filename).subscribe({
              next: (Result) => {
                this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, "RequestID" + this.Procurement_Request.procurement_Request_ID.toString(), file).subscribe({
                  next: (Response) => {

                    this.dataService.GetProcurementQuotesbyID(this.Procurement_Request.procurement_Request_ID).subscribe({
                      next: (PRResult) => {
                        this.Procurement_Request_Quote = PRResult[0]
                        let qPath = Response
                        this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
                        URL: URL = Response.url
                        this.Procurement_Request_Quote.path = URL.toString();
                        this.Procurement_Request_Quote.prefferedQuote = true;

                        let test: any
                        test = new DatePipe('en-ZA');
                        this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');

                        this.dataService.UpdateProcurementQuotes(this.Procurement_Request_Quote.quote_ID, this.Procurement_Request_Quote).subscribe({
                          next: (result) => {
                            // document.getElementById('AnimationBtn').classList.toggle("is_active");
                            // document.getElementById('cBtn').style.display = "none";
                            this.DisplayNotif()
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          });
        }
        else {
          // document.getElementById('AnimationBtn').classList.toggle("is_active");
          // document.getElementById('cBtn').style.display = "none";
          this.DisplayNotif()
        }
      }
    })
  }

  EditProcurementRequestB() {

    this.dataService.UpdatPRRequest(this.Procurement_Request.procurement_Request_ID, this.Procurement_Request).subscribe({
      next: (response) => {

        // this.DisplayNotif();
        for (let i = 0; i <= this.files.length - 1; i++) {

          if (this.files[0] != null || this.files[1] != null || this.files[2] != null) {
            if (this.files[i] != null) {
              let sFile = this.ProcurementQuotes[i].path;
              let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
              let VendorName = Stringtouse.substring(0, (Stringtouse.indexOf("/")))
              let RequestID = Stringtouse.substring(Stringtouse.indexOf("/") + 1, (Stringtouse.lastIndexOf("/")))
              let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
              this.dataService.DeleteProcurementRequestFiles(VendorName, RequestID, filename).subscribe({
                next: (Result) => {
                  let file: File = this.files[i]
                  this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, "RequestID" + this.Procurement_Request.procurement_Request_ID.toString(), file).subscribe({
                    next: (Response) => {
                      let qPath = Response
                      this.dataService.GetProcurementQuotesbyID(this.Procurement_Request.procurement_Request_ID).subscribe({
                        next: (PRResult) => {

                          if (i > 0) {
                            this.ProcurementQuotes = PRResult

                            this.ProcurementQuotes[i].procurement_Request = this.Procurement_Request
                            this.ProcurementQuotes[i].path = qPath.url;
                            this.ProcurementQuotes[i].prefferedQuote = false;

                            let test: any
                            test = new DatePipe('en-ZA');
                            this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
                            this.dataService.UpdateProcurementQuotes(this.ProcurementQuotes[i].quote_ID, this.ProcurementQuotes[i]).subscribe({
                              next: (result) => {
                                // document.getElementById('AnimationBtn').classList.toggle("is_active");
                                // document.getElementById('cBtn').style.display = "none";
                                this.DisplayNotif();
                              }
                            })
                          }

                          else {
                            this.ProcurementQuotes = PRResult
                            this.ProcurementQuotes[i].procurement_Request = this.Procurement_Request
                            this.ProcurementQuotes[i].path = qPath.url;
                            this.ProcurementQuotes[i].prefferedQuote = true;

                            let test: any
                            test = new DatePipe('en-ZA');
                            this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
                            this.dataService.UpdateProcurementQuotes(this.ProcurementQuotes[i].quote_ID, this.ProcurementQuotes[i]).subscribe({
                              next: (result) => {
                                // document.getElementById('AnimationBtn').classList.toggle("is_active");
                                // document.getElementById('cBtn').style.display = "none";
                                this.DisplayNotif();
                              }
                            })
                          }
                        }
                      })
                    }
                  })
                }
              })
            }
          }
          else {
            this.DisplayNotif()
          }
        };
      }
    })

  }
  OnCancel() {
    this.navController.navigateForward('/tabs/ViewProcurementRequest');

  }
}
