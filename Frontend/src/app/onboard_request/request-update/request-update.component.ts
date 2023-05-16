import { Component, OnInit,AfterContentInit, ViewChild } from '@angular/core';
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
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

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
    CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
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
      CompanyQuote: '',
    });
    this.rows.push(row);
    this.files.push('');
  }
  //add delete dataservice
  removeTab(index: number) {
    this.rows.removeAt(index);
    this.selectedIndex = index-1;
  }
 
  //redundant
  vendorsRequest: VendorOnboardRequest[] = [];
  onboardRequest: OnboardRequest[] = [];
  selectedIndex = 0;
  VendorType:boolean = true;
  FileDetails:any[] = [];
  
  ngOnInit() {

    const row = this._formBuilder.group({
      tab: [this.onboardRequest.length],
      CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
      CompanyQuote: '',
    });
    this.rows.push(row);
    this.fileToUpload = this.files[0]
   // console.log(this.onboardRequest[5])
    console.log(this.CompanyContactInfoFormGroup.controls.RequestData.value.length)

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        
        let RequestID = paramater.get("RequestNo");
        this.dataService.GetRequestByID(Number(RequestID)).subscribe(result => {
          let RequestList: any[] = result
          console.log(RequestList)
          RequestList.forEach((element) => {
            this.onboardRequest.push(element)
            
            const row = this._formBuilder.group({
              tab: [this.onboardRequest.length],
              CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
              CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
              CompanyQuote: '',
            });
            this.rows.push(row);
            this.files.push('');
            this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
            
          })  
          this.rows.removeAt(1);
          //this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
        if(RequestList.length > 2) {
          for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
            this.FileDetails.push({FileURL:"",FileName:""})
            this.rows.controls[i].get('CompanyName')?.setValue(this.onboardRequest[i].vendor.name);
            this.rows.controls[i].get('CompanyEmail')?.setValue(this.onboardRequest[i].vendor.email);
            let sFile = this.onboardRequest[i].quotes;
            let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
              
              this.FileDetails[i].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
              this.FileDetails[i].FileName = filename;           
          }
         }
         else 
         {
          let sFile = this.onboardRequest[0].quotes;
          if(sFile != "None") {
            this.FileDetails.push({FileURL:"",FileName:""})
           this.SoleSupplierFormGroup.get('CompanyName')?.setValue(this.onboardRequest[0].vendor.name);
           this.SoleSupplierFormGroup.get('CompanyEmail')?.setValue(this.onboardRequest[0].vendor.email);
           
           let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
           let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            
            this.FileDetails[0].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
            this.FileDetails[0].FileName = filename;
          }
          else {
            this.SoleSupplierFormGroup.get('CompanyName')?.setValue(this.onboardRequest[0].vendor.name);
            this.SoleSupplierFormGroup.get('CompanyEmail')?.setValue(this.onboardRequest[0].vendor.email);
          }
           
         }  
          
          if(RequestList.length < 2) {
            this.VendorType = false;
          }
          else {
            this.VendorType = true;
          }
          this.setActiveTab()
          
        })
      }
    });
}//ngOnInit

  setActiveTab() {
    this.selectedIndex = 0;
    console.log(this.selectedIndex)
  }
  //should also be delete
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
        let requestNo = paramater.get("RequestNo");
        this.Onboard_Request.onboard_Request_Id = Number(requestNo)
      }
    });


    for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
    
      //console.log(i)
      //we going to need to check that it does not repeat the same file 
    //   let sFi = sFile.substring(0,sFile.indexOf("\\"))
    //   sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    //  let sOR = sFile.substring(0,sFile.indexOf("\\"))
    //  sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
      
     // console.log(this.fileToUpload)
      if (this.files[i] != "" && this.onboardRequest[i] != undefined) {
        let sFile = this.onboardRequest[i].quotes;
        let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        this.dataService.DeleteFile(RequestNo,filename).subscribe!
    
        this.fileToUpload = this.files[i]
        console.log("if statement 1")
        RequestNo = "Request" + this.onboardRequest[0].onboard_Request_Id.toString();
        this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
          let Path: any = response
          this.sPath = Path.PathSaved.toString()
          this.Onboard_Request.quotes = this.sPath
          this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Vendor.vendor_Status_ID = 1;
          this.Vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor = this.Vendor;
          console.log(i)
          this.dataService.UpdateOnboardRequest(this.onboardRequest[i].onboard_Request_Id,this.onboardRequest[i].vendor_ID,this.Onboard_Request).subscribe(
            (RequestAdded) => {
              console.log(RequestAdded);
              this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
              console.log(i)
            }//response
          );//dataservice

        });//post
      }//if
      else {
        if (this.onboardRequest[i] != undefined) {
          console.log("if statement 2")
          this.Onboard_Request.quotes = this.onboardRequest[i].quotes
          this.Vendor.name = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyName;
          this.Vendor.email = this.CompanyContactInfoFormGroup.controls.RequestData.value[i].CompanyEmail;
          this.Vendor.vendor_Status_ID = 1;
          this.Vendor.number_Of_Times_Used = 0;
          this.Onboard_Request.vendor = this.Vendor;
          console.log(i)
          this.dataService.UpdateOnboardRequest(this.onboardRequest[i].onboard_Request_Id,this.onboardRequest[i].vendor_ID,this.Onboard_Request).subscribe(
          (RequestAdded) => {
            console.log(RequestAdded);
            this.router.navigate(['/request-view']);
            console.log(i)
          });//dataservice
        }
        else {
          console.log("if statement 3")
          let RequestNo = "Request" + this.onboardRequest[0].onboard_Request_Id.toString()
          this.dataService.OnboardFileAdd(RequestNo,this.fileToUpload).subscribe(response => {
          let Path: any = response
          
          this.sPath = Path.PathSaved.toString()
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
        }//else end
        
      }
      
    }//for loop

  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}