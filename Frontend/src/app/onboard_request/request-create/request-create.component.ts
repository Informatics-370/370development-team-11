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
    role: this.rl
  }

  Onboard_Request: OnboardRequest = {
    onboard_Request_Id: 0,
    user_Id: 1,
    vendor_ID: 0,
    vendor: { vendor_ID: 0, vendor_Status_ID: 0, vendor_Status: this.VStatus, name: '', email: '', number_Of_Times_Used: 0 },
    users: { user_Id: 0, role_ID: 0, username: '', password: '', profile_Picture: './assets/Images/Default_Profile.jpg', role: this.rl },
    quotes: '',
  }

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

  constructor(private _formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private http: HttpClient) { }
  addTab() {
    const row = this._formBuilder.group({
      tab: [this.rows.length + 1],
      CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CompanyQuote: ['', Validators.required],
    });
    this.rows.push(row);
    this.files.push('');
  }
  selectedIndex = 0;
  removeTab(index: number) {
    
    this.rows.removeAt(index);
    this.selectedIndex = index-1;
  }

  ngOnInit() {
    for (let i = 1; i < 4; i++) {
      const row = this._formBuilder.group({
        tab: [i],
        CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
        CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
        CompanyQuote: ['', Validators.required],
        
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
  sPath = "";
  AddRequest() {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let ReqNo = paramater.get("RequestNo");
        this.Onboard_Request.onboard_Request_Id = Number(ReqNo)
       
      }});
  // this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
      // this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
      // this.Vendor.vendor_Status_ID = 1;
      // this.Vendor.number_Of_Times_Used = 0;
      // this.Onboard_Request.vendor = this.Vendor;
      
  if(this.selectedOption == "true") {
    for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length+1; i++) {
    
      console.log(i)
      //we going to need to check that it does not repeat the same file 

      this.fileToUpload = this.files[i]

      if (this.fileToUpload != null) {

        let RequestNo:string = "Request" + this.Onboard_Request.onboard_Request_Id

        let file:File = this.fileToUpload
    
        this.dataService.OnboardFileAdd(RequestNo,file).subscribe(response => {
          let Path: any = response
          this.sPath = Path.pathSaved.toString()
          this.Onboard_Request.quotes = this.sPath
          this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Vendor.vendor_Status_ID = 1;
          this.Vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor = this.Vendor;
          console.log(i)
          this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(
            (RequestAdded) => {
              console.log(RequestAdded);
              this.router.navigate(['/request-view']);
              console.log(i)
            }//response
          );//dataservice

        });//post
      }//if
    }//for loop
  }
  else if(this.selectedOption == "false")
  {
    this.fileToUpload = this.files[0]

    if (this.files[0] != '') {
      let RequestNo = "Request" + this.Onboard_Request.onboard_Request_Id 
      this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
        let Path: any = response
        console.log(Path)
        this.sPath = Path.pathSaved.toString()
        this.Onboard_Request.quotes = this.sPath
        this.Vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value 
        this.Vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value 
        this.Vendor.vendor_Status_ID = 1;
        this.Vendor.number_Of_Times_Used = 0;
        this.Onboard_Request.vendor = this.Vendor;
        this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(
          (RequestAdded) => {
            console.log(RequestAdded);
            this.router.navigate(['/request-view']);
          }//response
        );//dataservice

      });//post
    }//if
    else {
        this.Onboard_Request.quotes = "None"
        this.Vendor.name = this.SoleSupplierFormGroup.get("CompanyName")?.value 
        this.Vendor.email = this.SoleSupplierFormGroup.get("CompanyEmail")?.value 
        this.Vendor.vendor_Status_ID = 1;
        this.Vendor.number_Of_Times_Used = 0;
        this.Onboard_Request.vendor = this.Vendor;
        this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(
          (RequestAdded) => {
            console.log(RequestAdded);
            this.router.navigate(['/request-view']);
          }//response
        );//dataservice
    }
    console.log("why")
  }
}
 

 

  }//addrequest 


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}