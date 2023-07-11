import { Component, OnInit, SecurityContext } from '@angular/core';
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
import { Onboard_Status } from 'src/app/Shared/OnboardStatus';
import { SoleSupplier } from 'src/app/Shared/Sole_Supplier';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-vendor-approve',
  templateUrl: './vendor-approve.component.html',
  styleUrls: ['./vendor-approve.component.css']
})
export class VendorApproveComponent implements OnInit {

  vendorsRequest: VendorOnboardRequest[] = [];
  onboardRequest: OnboardRequest[] = [];
  selectedIndex = 0;
  VendorType:boolean = true;
  FileDetails:any[] = [];
  panelOpenState = false;

  rows: FormArray = this._formBuilder.array([]);
  CompanyContactInfoFormGroup: FormGroup = this._formBuilder.group({ 'RequestData': this.rows });

  fileToUpload: File | null = null;
  files: File[] = [];
 
  selectedOption: string = "True";
  matcher = new MyErrorStateMatcher()
  Urls: any[] = [];
  constructor(private _formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private http: HttpClient,private dialog: MatDialog, private sanitizer:DomSanitizer) { }

  //@ViewChild(MatAccordion) accordion: Matac;

  safeURL(num:number) {
  //  console.log(this.FileDetails[num].FileURL)
    
   // return 
   // return this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToShow)
  }

  
  
  ngOnInit() {
    
    const row = this._formBuilder.group({
      tab: [this.onboardRequest.length],
      VendorID: 0,
      CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
      CompanyQuote: '',
    });
    this.rows.push(row);
   // this.fileToUpload = this.files[0]
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
              VendorID: 0,
              CompanyName: ['',[Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
              CompanyEmail: ['',[Validators.required,Validators.maxLength(32), Validators.email]],
              CompanyQuote: '',
            });
            this.rows.push(row);
            //this.files.push('');
            this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
            
          })  
          this.rows.removeAt(1);
          //this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
       
          for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
            this.FileDetails.push({FileURL:"",FileName:""})
            this.rows.controls[i].get('VendorID')?.setValue(this.onboardRequest[i].vendor_ID)
            this.rows.controls[i].get('CompanyName')?.setValue(this.onboardRequest[i].vendor.name);
            this.rows.controls[i].get('CompanyEmail')?.setValue(this.onboardRequest[i].vendor.email);
            let sFile = this.onboardRequest[i].quotes;
            let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
              this.FileDetails[i].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
              this.FileDetails[i].FileName = filename;     
              this.files.push(this.fileToUpload);
              this.dataService.GetOnboardFiles(RequestNo,filename).subscribe(result => {this.files[i] = result
              })
              
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
fileUrl: SafeResourceUrl[] = [];
fileType: string;
onFileUpload(i:number, event: any) {

  


 // this.fileToUpload = event.target.files[0];

  //this.fileToUpload = file
  this.openPDFInNewTab(i);
}


openPDFInNewTab(i:number): void {
  const url = this.FileDetails[i].FileURL;
  this.http.get(url, { responseType: 'blob' }).subscribe(response => {
    const fileURL = URL.createObjectURL(response);
    window.open(fileURL, '_blank');
  });
 // window.open(url, '_blank');
}




QuoteChecked = false;

onQuoteChecked() {
  if(this.QuoteChecked == false) {
    this.QuoteChecked = true;
  }
  else if(this.QuoteChecked == true) 
  {
    this.QuoteChecked = false;
  }


}


}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}