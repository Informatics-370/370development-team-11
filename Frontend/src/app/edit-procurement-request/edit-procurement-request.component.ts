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
import { AsyncPipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
      OtherQuote1: ['', [Validators.required]],
      OtherQuote2: ['', [Validators.required]],
      OtherQuote3: ['', [Validators.required]]
    })
  }

  BuildFormApproved() {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Vendor: ["", [Validators.required]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      Quote1: ['', [Validators.required]]
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

  AddProcurementRequestB() {
    this.Procurement_Request.name = this.myForm.get("RequestName").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    this.Procurement_Request.vendor.name = this.myForm.get("VendorName").value;
    this.Procurement_Request.vendor.email = this.myForm.get("Email").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    console.log(this.Procurement_Request)

    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({

      next: (response) => {
        console.log(response)
        var Counter = 0
        if (response != null) {
          this.files.forEach(element => {
            let file: File = element;
            this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
              next: (Response) => {
                console.log(Counter)
                if (Counter > 0) {
                  let qPath = Response
                  this.Procurement_Request = response[0]
                  this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
                  this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
                  this.Procurement_Request_Quote.prefferedQuote = false
                  console.log(false)
                }

                else {
                  let qPath = Response
                  this.Procurement_Request = response[0]
                  this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
                  this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
                  this.Procurement_Request_Quote.prefferedQuote = true
                  console.log(true)
                }
                let test: any
                test = new DatePipe('en-ZA');
                this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');
                Counter = Counter + 1;
                this.dataService.AddProcurementRequestQuote(this.Procurement_Request_Quote).subscribe({
                  next: (result) => {
                    this.DisplayNotif();
                  }
                })
              }
            })
          });
        }

        else {
          var action = "CREATE";
          var title = "CREATE UNSUCCESSFUL";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:red'> REJECTED </strong> Due to being used more than 2 times! </br> Please Onboard The vendor!");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 2000;
          setTimeout(() => {
            dialogRef.close();
            this.router.navigate(['/ViewProcurementRequest']);
          }, duration);
        }
      }
    })
  }

  DisplayNotif() {
    var action = "CREATE";
    var title = "CREATE SUCCESSFUL";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:green'> ADDED </strong> successfully!");

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

  AddProcurementRequestA() {
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
          let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
          let file: File = this.fileToUpload;
          this.dataService.DeleteProcurementRequestFiles(VendorName, filename).subscribe({
            next: (Result) => {
              this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
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
                  })




                }
              })
            }
          })
        });
      }
    })

    // this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
    //           this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
    //           this.Procurement_Request_Quote.prefferedQuote = true;


    // this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
    //   next: (response) => {
    //     if (response != null) {
    //       let file: File = this.fileToUpload;
    //       this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
    //         next: (Response) => {

    //           let qPath = Response
    //           this.Procurement_Request = response[0]
    //           this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
    //           this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
    //           this.Procurement_Request_Quote.prefferedQuote = true;

    //           console.log(this.Procurement_Request_Quote)

    //           this.dataService.AddProcurementRequestQuote(this.Procurement_Request_Quote).subscribe({
    //             next: (result) => {
    //               var action = "CREATE";
    //               var title = "CREATE SUCCESSFUL";
    //               var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:green'> ADDED </strong> successfully!");

    //               const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
    //                 disableClose: true,
    //                 data: { action, title, message }
    //               });

    //               const duration = 1750;
    //               setTimeout(() => {
    //                 dialogRef.close();
    //                 this.router.navigate(['/ViewProcurementRequest']);
    //               }, duration);
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  }


  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementRequest']);
  }
}
