import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions, FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { DatePipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { VendorOnboardRequest } from '../Shared/VendorOnboardRequest';
import { HttpClient } from '@angular/common/http';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';

@Component({
  selector: 'app-edit-procurement-request',
  templateUrl: './edit-procurement-request.component.html',
  styleUrls: ['./edit-procurement-request.component.css']
})
export class EditProcurementRequestComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  vendors: any[] = [];
  VendorType: String;

  VendorNameControl = new FormControl('');
  filteredVendors: Observable<VendorOnboardRequest[]>

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer, private ActRoute: ActivatedRoute, private http: HttpClient) { }
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



  ngOnInit(): void {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let usr = this.dataService.decodeUser(sessionStorage.getItem("token"));
        const id = paramater.get("procurement_Request_ID");
        this.VendorType = paramater.get("name");
        console.log(id)



        if (id) {
          this.dataService.GetPRRequestByID(Number(id)).subscribe({
            next: (RequestRecieved) => {
              this.Procurement_Request = RequestRecieved
              if (this.VendorType == "Other") {
                this.buildFormOther()
              }

              else {
                console.log(this.VendorType)
                this.BuildFormApproved()
              }
            }
          })

          this.dataService.GetProcurementQuotesbyID(Number(id)).subscribe({
            next: (response) => {
              this.ProcurementQuotes = response;
              console.log(this.ProcurementQuotes)
              this.GetPRQuotes()
            }
          })
        }
      }
    })
  }

  buildFormOther() {
    this.myForm = this.formBuilder.group({
      RequestName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      VendorName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      OtherDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      OtherQuote1: ['', []],
      OtherQuote2: ['', []],
      OtherQuote3: ['', []]
    })
  }

  BuildFormApproved() {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Vendor: ["", [Validators.required]],
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

  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
      URL.revokeObjectURL(fileURL);
    });
  }

  onFile1Upload(event: any) {
    document.getElementById("file1").style.border = this.originalBorderColor;
    document.getElementById("Error1").style.visibility = "hidden"
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
      if (this.files[0].name == this.files[1].name || this.files[0].name == this.files[2].name) {
        document.getElementById("file1").style.border = "solid red";
        document.getElementById("Error1").style.visibility = "visible"
        this.files[0] = null;
        this.myForm.get("OtherQuote1").reset();
      }
      else {
        this.files[0] = this.fileToUpload;
        document.getElementById("file1").style.border = this.originalBorderColor;
        document.getElementById("Error1").style.visibility = "hidden"
      }
    }
  }

  onFile2Upload(event: any) {
    document.getElementById("file2").style.border = this.originalBorderColor;
    document.getElementById("Error2").style.visibility = "hidden"
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[1] = this.fileToUpload;
      if (this.files[1].name == this.files[0].name || this.files[1].name == this.files[2].name) {
        document.getElementById("file2").style.border = "solid red";
        document.getElementById("Error2").style.visibility = "visible"
        this.files[1] = null;
        this.myForm.get("OtherQuote2").reset();
      }
      else {
        this.files[1] = this.fileToUpload;
        document.getElementById("file2").style.border = this.originalBorderColor;
        document.getElementById("Error2").style.visibility = "hidden"
      }
    }
  }

  onFile3Upload(event: any) {
    document.getElementById("file3").style.border = this.originalBorderColor;
    document.getElementById("Error3").style.visibility = "hidden"
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[2] = this.fileToUpload;
      if (this.files[2].name == this.files[0].name || this.files[2].name == this.files[1].name) {
        document.getElementById("file3").style.border = "solid red";
        document.getElementById("Error3").style.visibility = "visible"
        this.files[2] = null;
        this.myForm.get("OtherQuote3").reset();
      }
      else {
        this.files[2] = this.fileToUpload;
        document.getElementById("file3").style.border = this.originalBorderColor;
        document.getElementById("Error3").style.visibility = "hidden"
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

  EditProcurementRequestB() {

    this.Procurement_Request.name = this.myForm.get("RequestName").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    console.log(this.Procurement_Request)

    var CounterForNewFiles = 0;
    var Counter = 0;

    this.dataService.UpdatPRRequest(this.Procurement_Request.procurement_Request_ID, this.Procurement_Request).subscribe({
      next: (response) => {
        console.log(this.Procurement_Request)
        console.log(response)

        // this.DisplayNotif();
        for (let i = 0; i <= this.files.length - 1; i++) {

          if (this.files[i] != null) {


            let sFile = this.ProcurementQuotes[i].path;
            console.log(sFile)
            let VendorName = sFile.substring(0, sFile.indexOf("\\"))
            let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
            let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)
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
                          console.log(this.ProcurementQuotes)

                          this.ProcurementQuotes[i].procurement_Request = this.Procurement_Request
                          this.ProcurementQuotes[i].path = qPath.pathSaved.toString();
                          this.ProcurementQuotes[i].prefferedQuote = false;

                          let test: any
                          test = new DatePipe('en-ZA');
                          this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
                          this.dataService.UpdateProcurementQuotes(this.ProcurementQuotes[i].quote_ID, this.ProcurementQuotes[i]).subscribe({
                            next: (result) => {
                              console.log(result)
                              this.DisplayNotif();
                              Counter = Counter + 1;
                            }
                          })
                        }

                        else {
                          this.ProcurementQuotes = PRResult
                          this.ProcurementQuotes[i].procurement_Request = this.Procurement_Request
                          this.ProcurementQuotes[i].path = qPath.pathSaved.toString();
                          this.ProcurementQuotes[i].prefferedQuote = true;

                          let test: any
                          test = new DatePipe('en-ZA');
                          this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
                          this.dataService.UpdateProcurementQuotes(this.ProcurementQuotes[i].quote_ID, this.ProcurementQuotes[i]).subscribe({
                            next: (result) => {
                              console.log(result)
                              this.DisplayNotif();
                              Counter = Counter + 1;
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

          else {
            Counter = Counter + 1;
          }
        };
      }
    })

  }

  DisplayNotif() {
    this.log.action = "Edited Procurement Request: " + this.Procurement_Request.name;
    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.dataService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        var action = "UPDATE";
        var title = "UPDATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
          this.router.navigate(['/ViewProcurementRequest']);
        }, duration);
      }
    })

  }

  EditProcurementRequestA() {
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;
    console.log(this.Procurement_Request)


    this.dataService.UpdatPRRequest(this.Procurement_Request.procurement_Request_ID, this.Procurement_Request).subscribe({
      next: (response) => {
        console.log(this.Procurement_Request)
        console.log(response)
        this.ProcurementQuotes.forEach(element => {
          let sFile = element.path;
          console.log(sFile)
          let VendorName = sFile.substring(0, sFile.indexOf("\\"))
          let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
          let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)
          let file: File = this.fileToUpload;
          this.dataService.DeleteProcurementRequestFiles(VendorName, RequestID, filename).subscribe({
            next: (Result) => {
              this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, "RequestID" + this.Procurement_Request.procurement_Request_ID.toString(), file).subscribe({
                next: (Response) => {
                  console.log(Response)

                  this.dataService.GetProcurementQuotesbyID(this.Procurement_Request.procurement_Request_ID).subscribe({
                    next: (PRResult) => {
                      console.log(PRResult)
                      this.Procurement_Request_Quote = PRResult[0]
                      let qPath = Response
                      this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
                      this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
                      this.Procurement_Request_Quote.prefferedQuote = true;

                      let test: any
                      test = new DatePipe('en-ZA');
                      this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');

                      this.dataService.UpdateProcurementQuotes(this.Procurement_Request_Quote.quote_ID, this.Procurement_Request_Quote).subscribe({
                        next: (result) => {
                          console.log(result)
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
    })
  }


  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementRequest']);
  }
}
