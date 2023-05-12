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
  selector: 'app-request-update',
  templateUrl: './request-update.component.html',
  styleUrls: ['./request-update.component.css']
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
    Reason: ['', [Validators.required, Validators.maxLength(32)]],
    CompanyQuote: ['', Validators.required],
  })
  rows: FormArray = this._formBuilder.array([]);
  CompanyContactInfoFormGroup: FormGroup = this._formBuilder.group({ 'RequestData': this.rows });

  fileToUpload: File | null = null;
  files: any[] = ['', '', ''];

  selectedOption: string = "True";
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

  removeTab(index: number) {
    this.rows.removeAt(index);
  }
  vendorsRequest: VendorOnboardRequest[] = [];
  onboardRequest: OnboardRequest[] = [];
  requestNo = 0;
  ngOnInit() {


    console.log(this.CompanyContactInfoFormGroup.controls.RequestData.value.length)

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let requestNo = paramater.get("RequestNo");
        this.requestNo = Number(requestNo)
      }
    });

    this.getVendors()
    this.getRequestDetails(this.requestNo)

    console.log(this.onboardRequest.length)

for(let i = 1; i < this.onboardRequest.length;i++) {
  const row = this._formBuilder.group({
    tab: [i],
    CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
    CompanyQuote: ['', Validators.required],
  });
  this.rows.push(row);
  this.files.push('');
}


  }

  getVendors() {
    this.dataService.GetVendorsRequest().subscribe(result => {
      let VendorList: any[] = result
      VendorList.forEach((element) => {
        this.vendorsRequest.push(element)
        console.log(element)
      })
    })
  }

  getRequestDetails(ReqNo: number) {
    this.dataService.GetRequest(ReqNo).subscribe(result => {
      let RequestList: any[] = result
      RequestList.forEach((element) => {
        this.onboardRequest.push(element)
        console.log(element)
      })
    })
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

  AddRequest() {

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        let requestNo = paramater.get("RequestNo");
        this.Onboard_Request.onboard_Request_Id = Number(requestNo)
      }
    });


    for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
      this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
      this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
      this.Vendor.vendor_Status_ID = 1;
      this.Vendor.number_Of_Times_Used = 0;
      this.Onboard_Request.vendor = this.Vendor;

      const formData = new FormData();
      this.fileToUpload = this.files[i]

      if (this.fileToUpload != null) {
        let test = "Request" + this.Onboard_Request.onboard_Request_Id.toString()
        formData.append('file', this.fileToUpload);
        formData.append('RequestNo', test)
        this.http.post('https://localhost:7186/api/OnboardRequest/uploadFile/', formData).subscribe(response => {
          let sPath: any = response
          this.Onboard_Request.quotes = sPath.filePath.toString()
          this.dataService.AddOnboardRequest(this.Onboard_Request).subscribe(
            (RequestAdded) => {
              console.log(RequestAdded);
              this.router.navigate(['/request-view']);
            }
          );
        });
      }

    }

  }


}






export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}