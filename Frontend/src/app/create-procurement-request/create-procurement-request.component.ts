import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';

@Component({
  selector: 'app-create-procurement-request',
  templateUrl: './create-procurement-request.component.html',
  styleUrls: ['./create-procurement-request.component.css']
})
export class CreateProcurementRequestComponent implements OnInit{
  myForm: FormGroup = new FormGroup({});
  vendors: any [] =[];
  VendorType : String = 'Approved';

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
    path: ""
  }

  fileToUpload: File | null = null;
  files: any[] = [''];
  sPath = "";

  ngOnInit(): void {
    console.log(this.VendorType)
    if(this.VendorType == "Approved"){
      this.myForm = this.formBuilder.group({
        Selection: ["Approved",[Validators.required]],
        Vendor: [0, [Validators.required]],
        Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        Quote1: ['', [Validators.required]]
      })
      this.GetVendors();
    }

    else{
      this.myForm = this.formBuilder.group({
        OtherSelection: ["Other",[Validators.required]],
        Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
        OtherDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
        OtherQuote1: ['', [Validators.required]],
        OtherQuote2: ['', [Validators.required]],
        OtherQuote3: ['', [Validators.required]]
      })
      this.GetVendors();
    }

    
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

  SetValueA(){
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("Selection").value;
    this.ngOnInit();
  }

  SetValueB(){
    this.vendors.splice(0, this.vendors.length);
    this.VendorType = this.myForm.get("OtherSelection").value;
    this.ngOnInit();
  }

  GetVendors(){
    this.dataService.GetVendorsRequest().subscribe({
      next: (response) => {
        console.log(response)
        let VendorList : any[] = response
        VendorList.forEach((element) =>
        {
          this.vendors.push(element)
        })
      }
    })

    console.log(this.vendors)
  }

  AddProcurementRequestB(){
    this.Procurement_Request.name = this.myForm.get("Name").value;
    this.Procurement_Request.description = this.myForm.get("OtherDescription").value;
    this.Procurement_Request.vendor.name = this.myForm.get("Name").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
        if(response != null){
          this.files.forEach(element => {
            let file: File = element;
            console.log(file);
            console.log(this.Procurement_Request.vendor.name)
           this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file ).subscribe({
            next: (Response) => {
  
              let qPath = Response
              this.Procurement_Request = response[0]
              this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
              this.Procurement_Request_Quote.path = qPath.pathSaved.toString();
  
              this.dataService.AddProcurementRequestQuote(this.Procurement_Request_Quote).subscribe({
                next: (result) => {
                              // console.log(Response)
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
          }); 
        }
      }
    })
  }

  AddProcurementRequestA(){
    this.Procurement_Request.name = this.myForm.get("Vendor").value;
    this.Procurement_Request.description = this.myForm.get("Description").value;
    this.Procurement_Request.vendor.name = this.myForm.get("Vendor").value;
    this.Procurement_Request.user.username = this.dataService.decodeUserRole(sessionStorage.getItem("token"));


    this.dataService.AddProcurementRequest(this.Procurement_Request).subscribe({
      next: (response) => {
        if(response != null){
          let file: File = this.fileToUpload;
         this.dataService.ProcurementRequestFileAdd(this.Procurement_Request.vendor.name, file ).subscribe({
          next: (Response) => {

            let qPath = Response
            this.Procurement_Request = response[0]
            this.Procurement_Request_Quote.procurement_Request = this.Procurement_Request
            this.Procurement_Request_Quote.path = qPath.pathSaved.toString();

            console.log(this.Procurement_Request_Quote)

            this.dataService.AddProcurementRequestQuote(this.Procurement_Request_Quote).subscribe({
              next: (result) => {
                            // console.log(Response)
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
