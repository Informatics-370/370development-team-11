import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions, FormsModule } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-create-procurement-request',
  templateUrl: './create-procurement-request.component.html',
  styleUrls: ['./create-procurement-request.component.css']
})
export class CreateProcurementRequestComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  vendors: any[] = [];
  VendorType: String = 'Approved';

  VendorNameControl = new FormControl('');
  filteredVendors: Observable<VendorOnboardRequest[]>

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

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
  files: File[] = [null, null, null];
  ProcurementQuotes: Procurement_Request_Quote[] = [null, null, null]
  FinalisedProcurementQuotes: Procurement_Request_Quote[] = []
  sPath = "";
  uploadedPathArray: any[] = []

  originalBorderColor: string = 'solid #244688';

  ngOnInit(): void {
    if (this.VendorType == "Approved") {
      this.myForm = this.formBuilder.group({
        Selection: ["Approved", [Validators.required]],
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        Vendor: [0, [Validators.required]],
        Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Quote1: ['', [Validators.required]]
      })
      this.GetVendors();
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
      this.GetVendors();

      this.filteredVendors = this.VendorNameControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      )
    }


  }

  private _filter(value: string): VendorOnboardRequest[] {
    const filterValue = value.toLowerCase();
    const filteredVendors = this.vendors.filter(option => option.name.toLowerCase().includes(filterValue));

    this.setVal(value)
    // If no vendors match the filter, return an array with a single element containing the entered value
    return this.vendors.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  setVal(Name: String) {
    this.myForm.get("VendorName").setValue(Name)
  }

  onFile1Upload(event: any) {
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
        document.getElementById("file1").style.border = this.originalBorderColor;
        document.getElementById("Error1").style.visibility = "hidden"
      }
    }
  }

  onFile2Upload(event: any) {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[1] = this.fileToUpload;
      if (this.files[1].name == this.files[0].name || this.files[1].name == this.files[2].name) {
        document.getElementById("file2").style.border = "solid red";
        document.getElementById("Error2").style.visibility = "visible"
        this.files[2] = null;
        this.myForm.get("OtherQuote2").reset();
      }
      else {
        document.getElementById("file2").style.border = this.originalBorderColor;
        document.getElementById("Error2").style.visibility = "hidden"
      }
    }
  }

  onFile3Upload(event: any) {
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
        document.getElementById("file3").style.border = this.originalBorderColor;
        document.getElementById("Error3").style.visibility = "hidden"
      }
    }
  }

  SetValueA() {
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("Selection").value;
    this.myForm.reset()
    this.ngOnInit();
  }

  SetValueB() {
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("OtherSelection").value;
    this.myForm.reset()
    this.ngOnInit();
  }

  GetVendors() {
    this.dataService.GetVendorsRequest().subscribe({
      next: (response) => {
        let VendorList: any[] = response
        VendorList.forEach((element) => {
          this.vendors.push(element)
        })
      }
    })
  }

  AddProcurementRequestB() {

    this.Procurement_Request.name = this.myForm.get("RequestName").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    this.Procurement_Request.vendor.name = this.myForm.get("VendorName").value;
    this.Procurement_Request.vendor.email = this.myForm.get("Email").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
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
      }
    })
  }

  GetQuoteDetails() {
    if (this.uploadedPathArray.length === this.files.length) {
      console.log(this.files)
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
        console.log(UploadedPath)
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

        console.log(this.ProcurementQuotes)
      }
      this.AddQuote()
    }
    else {
      //Do Nothin
    }


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
                      this.DisplayNotif()
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
    this.Procurement_Request.vendor.name = this.myForm.get("Vendor").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
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
              })
            }
          })
        }
        else {
          var action = "CREATE";
          var title = "LIMIT EXCEEDED";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Vendor: <strong>" + this.Procurement_Request.name + "</strong> will need to be <strong style='color:red'> ONBOARDED </strong> in order to make this request!");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
            this.myForm.reset();
            this.ngOnInit()

          }, duration);
        }
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
