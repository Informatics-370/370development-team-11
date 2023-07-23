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

  Procurement_Request_Quote: Procurement_Request_Quote = {
    quote_ID: 0,
    procurement_Request_ID: 0,
    procurement_Request: this.Procurement_Request,
    path: "",
    upload_Date: new Date(),
    prefferedQuote: false
  }

  fileToUpload: File | null = null;
  files: any[] = [''];
  sPath = "";

  ProcurementQuotes: Procurement_Request_Quote[] = []
  FileDetails: any[] = [];



  ngOnInit(): void {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
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
      // OtherQuote1: ['', []],
      // OtherQuote2: ['', []],
      // OtherQuote3: ['', []]
    })
  }

  BuildFormApproved() {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Vendor: ["", [Validators.required]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      // Quote1: ['', []]
    })
  }

  GetPRQuotes() {
    for (let i = 0; i < this.ProcurementQuotes.length; i++) {
      this.FileDetails.push({ FileURL: "", FileName: "" })
      let sFile = this.ProcurementQuotes[i].path;

      if (sFile != "None") {
        let VendorName = sFile.substring(0, sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

        this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${filename}`
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
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onFile2Upload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[1] = this.fileToUpload;
    }
  }

  onFile3Upload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[2] = this.fileToUpload;
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

        this.DisplayNotif();
        // this.ProcurementQuotes.forEach(element => {

        //   if (this.files[Counter] != null) {

        //     console.log(this.files[Counter])

        //     let sFile = this.ProcurementQuotes[Counter].path;
        //     console.log(sFile)
        //     let VendorName = sFile.substring(0, sFile.indexOf("\\"))
        //     let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
        //     this.dataService.DeleteProcurementRequestFiles(VendorName, filename).subscribe({
        //       next: (Result) => {
        //         let file: File = this.files[Counter]
        //         this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
        //           next: (Response) => {
        //             this.dataService.GetProcurementQuotesbyID(this.Procurement_Request.procurement_Request_ID).subscribe({
        //               next: (PRResult) => {

        //                 if (CounterForNewFiles > 0) {
        //                   this.Procurement_Request_Quote = PRResult[Counter]
        //                   let qPath = Response
        //                   this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
        //                   this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
        //                   this.Procurement_Request_Quote.prefferedQuote = false;

        //                   let test: any
        //                   test = new DatePipe('en-ZA');
        //                   this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
        //                   CounterForNewFiles = CounterForNewFiles + 1;
        //                 }

        //                 else {
        //                   this.Procurement_Request_Quote = PRResult[Counter]
        //                   let qPath = Response
        //                   this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
        //                   this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
        //                   this.Procurement_Request_Quote.prefferedQuote = true;

        //                   let test: any
        //                   test = new DatePipe('en-ZA');
        //                   this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
        //                   CounterForNewFiles = CounterForNewFiles + 1;
        //                 }



        //                 this.dataService.UpdateProcurementQuotes(this.Procurement_Request_Quote.quote_ID, this.Procurement_Request_Quote).subscribe({
        //                   next: (result) => {
        //                     console.log(result)
        //                     this.DisplayNotif();
        //                     Counter = Counter + 1;
        //                   }
        //                 })
        //               }
        //             })
        //           }
        //         })
        //       }
        //     })
        //   }

        //   else {
        //     Counter = Counter + 1;
        //     this.DisplayNotif();
        //   }
        // });
      }
    })

  }

  DisplayNotif() {
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

  EditProcurementRequestA() {
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;
    console.log(this.Procurement_Request)


    this.dataService.UpdatPRRequest(this.Procurement_Request.procurement_Request_ID, this.Procurement_Request).subscribe({
      next: (response) => {
        console.log(this.Procurement_Request)
        console.log(response)

        this.DisplayNotif();
        // this.ProcurementQuotes.forEach(element => {
        //   let sFile = element.path;
        //   console.log(sFile)
        //   let VendorName = sFile.substring(0, sFile.indexOf("\\"))
        //   let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
        //   let file: File = this.fileToUpload;
        //   this.dataService.DeleteProcurementRequestFiles(VendorName, filename).subscribe({
        //     next: (Result) => {
        //       this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
        //         next: (Response) => {
        //           console.log(Response)

        //           this.dataService.GetProcurementQuotesbyID(this.Procurement_Request.procurement_Request_ID).subscribe({
        //             next: (PRResult) => {
        //               console.log(PRResult)
        //               this.Procurement_Request_Quote = PRResult[0]
        //               let qPath = Response
        //               this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
        //               this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
        //               this.Procurement_Request_Quote.prefferedQuote = true;

        //               let test: any
        //               test = new DatePipe('en-ZA');
        //               this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');

        //               this.dataService.UpdateProcurementQuotes(this.Procurement_Request_Quote.quote_ID, this.Procurement_Request_Quote).subscribe({
        //                 next: (result) => {
        //                   console.log(result)
        //                   this.DisplayNotif()
        //                 }
        //               })
        //             }
        //           })
        //         }
        //       })
        //     }
        //   })
        // });
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
