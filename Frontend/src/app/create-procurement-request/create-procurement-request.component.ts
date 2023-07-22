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

  NameControl = new FormControl('');
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
    upload_Date: new Date()
  }

  fileToUpload: File | null = null;
  files: any[] = [''];
  sPath = "";

  ngOnInit(): void {
    if (this.VendorType == "Approved") {
      this.myForm = this.formBuilder.group({
        Selection: ["Approved", [Validators.required]],
        Vendor: [0, [Validators.required]],
        Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Quote1: ['', [Validators.required]]
      })
      this.GetVendors();
    }

    else {
      this.myForm = this.formBuilder.group({
        OtherSelection: ["Other", [Validators.required]],
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        OtherDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        OtherQuote1: ['', [Validators.required]],
        OtherQuote2: ['', [Validators.required]],
        OtherQuote3: ['', [Validators.required]]
      })
      this.GetVendors();

      this.filteredVendors = this.NameControl.valueChanges.pipe(
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
    this.myForm.get("Name").setValue(Name)
  }

  onFile1Upload(event: any) {
    console.log(this.myForm.get("Name").value)
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

  SetValueA() {
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("Selection").value;
    this.ngOnInit();
  }

  SetValueB() {
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("OtherSelection").value;
    this.ngOnInit();
  }

  GetVendors() {
    this.dataService.GetVendorsRequest().subscribe({
      next: (response) => {
        console.log(response)
        let VendorList: any[] = response
        VendorList.forEach((element) => {
          this.vendors.push(element)
        })
      }
    })

    console.log(this.vendors)
  }

  AddProcurementRequestB() {
    console.log(this.myForm.get("Name").value)
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    this.Procurement_Request.vendor.name = this.myForm.get("Name").value;
    this.Procurement_Request.vendor.email = this.myForm.get("Email").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
        console.log(response)
        if (response != null) {
          this.files.forEach(element => {
            let file: File = element;
            console.log(file);
            console.log(this.Procurement_Request.vendor.name)
            this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
              next: (Response) => {

                let qPath = Response
                this.Procurement_Request = response[0]
                this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
                this.Procurement_Request_Quote.path = qPath.pathSaved.toString();

                let test: any
                test = new DatePipe('en-ZA');
                this.Procurement_Request_Quote.upload_Date = test.transform(this.Procurement_Request_Quote.upload_Date, 'MMM d, y, h:mm:ss a');


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
    this.Procurement_Request.name = this.myForm.get("Vendor").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;
    this.Procurement_Request.vendor.name = this.myForm.get("Vendor").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
        if (response != null) {
          let file: File = this.fileToUpload;
          this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file).subscribe({
            next: (Response) => {

              let qPath = Response
              this.Procurement_Request = response[0]
              this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
              this.Procurement_Request_Quote.path = qPath.pathSaved.toString();

              console.log(this.Procurement_Request_Quote)

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
