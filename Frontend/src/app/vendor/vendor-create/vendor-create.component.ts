import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { Vendor_Category } from 'src/app/Shared/VendorCategory';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { DataService } from 'src/app/DataService/data-service';
import { Vendor_Fax } from 'src/app/Shared/VendorDetailsFax';
import { Vendor_Vat } from 'src/app/Shared/VendorDetailsVatRegistered';
import { Vendor_Website } from 'src/app/Shared/VendorDetailsWebsite';
import { Vendor_License } from 'src/app/Shared/VendorDetailsLicense';
import { Vendor_Agreement } from 'src/app/Shared/VendorDetailsSignedAgreement';
import { Vendor_Insurance } from 'src/app/Shared/VendorDetailsInsurance';
import { Vendor_Payment_Terms } from 'src/app/Shared/VendorDetailsPaymentTerms';
import { Vendor_Tax } from 'src/app/Shared/VendorDetailsIncomeTaxNum';
import { Vendor_Registration } from 'src/app/Shared/VendorDetailsRegistration';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrls: ['./vendor-create.component.css']
})



export class VendorCreateComponent implements OnInit{

  vendorCat: Vendor_Category = {
    Vendor_Category_ID:0,
    Name:"",
    Description:"",
  };

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
    sole_Supplier_Provided: false,
  }
  VendorDetail: VendorDetails = {
    vendor_Detail_ID:0,
    vendor_Category_ID:0,
    vendor_ID:0,
    vendor_Category: this.vendorCat,
    vendor:this.Vendor,
    telephone_Num:"",
    contact_Person_Title:"",
    contact_Person_Name:"",
    contact_Person_ContactNum:"",
    contact_Person_Email:"",
    registered_Address:"",
    faxProvided: false,
    websiteProvided:false,
    description_GSP:"",

    vatRegistered:false,
    registration_Provided:false,
    income_Tax_Num_Provided:false,
    soleSupplierProvided:false,
    pOPIA_Provided:false,
    payment_Terms_Provided:false,
    insurance_Provided:false,
    signed_Agreement_Provided:false,
    license_Num_Provided:false,

    bank_Name:"",
    account_Holder:"",
    bank_Account_Number:"",
    branch_Code:"",
    account_Type:"",
    bank_Contact_Name:"",
    bank_Contact_PhoneNum:"",
    bankStampedConfirtmation:"",
    beeRegistered:false,
    dueDIllegenceRequired:false,
    dateAccepted:new Date(),
  }

  Vendorfax: Vendor_Fax = {
    fax_ID: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    fax:"",
  }

  VendorVat: Vendor_Vat = {
    vat_Registration_Number: "",
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    vaT_Registration_Document:"",
  }

  VendorWebsite: Vendor_Website = {
    website_ID: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    url:"",
  }

  VendorLicense: Vendor_License = {
    license_No: "",
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    license_Doc_Upload:"",
  }

  VendorAgreement: Vendor_Agreement = {
    agreement_ID: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    signed_Agreement_Doc:"",
  }

  VendorInsurance: Vendor_Insurance = {
    insurance_ID: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    confirmation_Doc:"",
  }

  VendorPaymentTerms: Vendor_Payment_Terms = {
    payment_Terms_ID: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    payment_Terms:"",
  }

  VendorTax : Vendor_Tax = {
    income_Tax_Num: "",
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    tax_Clearance_Cert:"",
  }

  VendorRegistration  : Vendor_Registration = {
    company_Registration_Number: "",
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    proof_Of_Registration_Doc:"",
  }


  CompanyContactInfoFormGroup = this._formBuilder.group({
    CompanyName: '',
    CompanyEmail: '',
    CompanyFax: ['',[Validators.maxLength(32), Validators.pattern(/^[0-9]*$/)]],
    CompanyFaxCheck: false,
    CompanyTelphone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
    CompanyRegisteredAddress: ['', [Validators.required,Validators.maxLength(100), Validators.pattern(/^[0-9a-zA-Z\s]*$/)]],
    CompanyWebsite: '',
    CompanyWebsiteCheck: false,
    ContactPersonTitle: ['', [Validators.required,Validators.maxLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    ContactPersonName: ['', [Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    ContactPersonPhone: ['', [Validators.required,Validators.maxLength(10),Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]],
    ContactPersonEmail: ['', [Validators.required,Validators.maxLength(32),Validators.email]],
  });
  CompanyOverviewFormGroup = this._formBuilder.group({
    DetailsOfServiceOrGoods: ['', [Validators.required,Validators.maxLength(50)]],
    CompanyRegistrationNumber: ['',[Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^[0-9]*$/)]],
    CompanyRegistrationNumberDoc: ['', Validators.required],
    VatRegistrationCheck: false,
    VatRegistrationNumber: ['',Validators.pattern(/^[0-9]*$/)],
    VatRegistrationNumberDoc: null,
    IncomeTaxNumber: ['', [Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^[0-9]*$/)]],
    IncomeTaxNumberDoc: ['', Validators.required],
    SignedAgreementCheck: false,
    SignedAgreementDoc: null,
    InsuranceCoverCheck: false,
    InsuranceCoverDoc: null,
    PaymentTermsCheck: false,
    PaymentTerms: ['',Validators.maxLength(50)],
    LicenseOrAccreditationCheck: false,
    LicenseOrAccreditationNumber: '',
    LicenseOrAccreditationNumberDoc: null,
  });
  BankDetailsFormGroup = this._formBuilder.group({
    BankName: ['', [Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    BranchCode: ['', [Validators.required,Validators.maxLength(6),Validators.minLength(6), Validators.pattern("^[0-9]*$")]],
    AccountHolder: ['', [Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    AccountType: ['', [Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    AccountNumber: ['', [Validators.required,Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
    BankContactName: ['', [Validators.required,Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    BankContactPhoneNumber: ['', [Validators.required,Validators.maxLength(10),Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
    BankStampedConfirmationLetter:['', Validators.required],
  });

  CompanyFaxChecker:any;
  CompanyWebsiteChecker:any;
  VatRegistrationChecker:any;
  SignedAgreementChecker:any;
  InsuranceCoverChecker:any;
  PaymentTermsChecker:any;
  LicenseOrAccreditationChecker:any;

  matcher = new MyErrorStateMatcher()

  constructor(private _formBuilder: FormBuilder,private VendorService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

  fileName:any[] = ['','','','','','','']
  
     FileStorage(id:number, event: any) {
        this.fileName[id] = event.target.files[0];
        // console.log(this.fileName)
        // let stest:File = event.target.files[0];
        // console.log(stest)
     }

  ngOnInit(): void {
    console.log(this.fileName)
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorID = paramater.get("VendorID");
        this.VendorService.GetVendorByID(Number(VendorID)).subscribe(result => {
          this.Vendor = result
          this.VendorDetail.vendor_ID == this.Vendor.vendor_ID
          this.CompanyContactInfoFormGroup.get('CompanyName')?.setValue(this.Vendor.name);
          this.CompanyContactInfoFormGroup.get('CompanyName').disable()
          this.CompanyContactInfoFormGroup.get('CompanyEmail')?.setValue(this.Vendor.email);
          this.CompanyContactInfoFormGroup.get('CompanyEmail').disable()

          if(this.Vendor.sole_Supplier_Provided == false) {
            this.VendorDetail.vendor_Category_ID = 1;
          }
          else {
            this.VendorDetail.vendor_Category_ID = 2;
            this.VendorDetail.soleSupplierProvided = true;
          }

          

        })
      }
    }
    )}//ngomt

  
 

  CompanyWebsiteChange(){

    this.CompanyWebsiteChecker = this.CompanyContactInfoFormGroup.get("CompanyWebsiteCheck")?.value 
    if(this.CompanyWebsiteChecker == true) {
      this.CompanyContactInfoFormGroup.get('CompanyWebsite')?.addValidators(Validators.required)
      this.CompanyContactInfoFormGroup.get('CompanyWebsite')?.enable()
    }
    else {
      this.CompanyContactInfoFormGroup.get('CompanyWebsite')?.disable();
    }
      
    
  }

  CompanyFaxChange(){
    this.CompanyFaxChecker = this.CompanyContactInfoFormGroup.get("CompanyFaxCheck")?.value 
    if(this.CompanyFaxChecker == true) {
      this.CompanyContactInfoFormGroup.get('CompanyFax')?.addValidators(Validators.required)
      this.CompanyContactInfoFormGroup.get('CompanyFax')?.enable()
    }
    else {
      this.CompanyContactInfoFormGroup.get('CompanyFax')?.disable();
      
    }
  }

  VatRegistrationChange() {
    this.VatRegistrationChecker = this.CompanyOverviewFormGroup.get("VatRegistrationCheck")?.value
    if(this.VatRegistrationChecker == true) {
      this.CompanyContactInfoFormGroup.get('VatRegistrationNumber')?.addValidators(Validators.required)
      this.CompanyContactInfoFormGroup.get('VatRegistrationNumber')?.enable()

      this.CompanyContactInfoFormGroup.get('VatRegistrationNumberDoc')?.addValidators(Validators.required)
      this.CompanyContactInfoFormGroup.get('VatRegistrationNumberDoc')?.enable()
    }
    else {
      this.CompanyContactInfoFormGroup.get('VatRegistrationNumber')?.disable();

      this.CompanyContactInfoFormGroup.get('VatRegistrationNumberDoc')?.disable();
      
    }
   }

    SignedAgreementChange() {
      this.SignedAgreementChecker = this.CompanyOverviewFormGroup.get("SignedAgreementCheck")?.value
      if(this.SignedAgreementChecker == true) {
        this.CompanyContactInfoFormGroup.get('SignedAgreementDoc')?.addValidators(Validators.required)
        this.CompanyContactInfoFormGroup.get('SignedAgreementDoc')?.enable()
      }
      else {
        this.CompanyContactInfoFormGroup.get('SignedAgreementDoc')?.disable();   
      }
    }

    InsuranceCoverChange() {
      this.InsuranceCoverChecker = this.CompanyOverviewFormGroup.get("InsuranceCoverCheck")?.value
      if(this.InsuranceCoverChecker == true) {
        this.CompanyContactInfoFormGroup.get('InsuranceCoverDoc')?.addValidators(Validators.required)
        this.CompanyContactInfoFormGroup.get('InsuranceCoverDoc')?.enable()
      }
      else {
        this.CompanyContactInfoFormGroup.get('InsuranceCoverDoc')?.disable();   
      }
    }

    PaymentTermsChange() {
      this.PaymentTermsChecker = this.CompanyOverviewFormGroup.get("PaymentTermsCheck")?.value
      if(this.PaymentTermsChecker == true) {
        this.CompanyContactInfoFormGroup.get('PaymentTerms')?.addValidators(Validators.required)
        this.CompanyContactInfoFormGroup.get('PaymentTerms')?.enable()
      }
      else {
        this.CompanyContactInfoFormGroup.get('PaymentTerms')?.disable();   
      }
    }

    LicenseOrAccreditationChange() {
      this.LicenseOrAccreditationChecker = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationCheck")?.value
      console.log(this.LicenseOrAccreditationChecker)
      if(this.LicenseOrAccreditationChecker == true) {
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumber')?.addValidators(Validators.required)
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumber')?.enable()
  
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumberDoc')?.addValidators(Validators.required)
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumberDoc')?.enable()
      }
      else {
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumber')?.disable();
  
        this.CompanyContactInfoFormGroup.get('LicenseOrAccreditationNumberDoc')?.disable();
        
      }
     }
 

     Passed: boolean = true
  Validate() {
    this.Passed = true
    for(let a = 0; a < this.fileName.length;a++) {
      for(let b = 0;b<this.fileName.length;b++) {
        if (this.fileName[a].name != "" && this.fileName[a].name == this.fileName[b].name || this.fileName[a].size == 0) {
          this.Passed = false;
        }
      }
    }
    if(this.Passed == false) {
      var action = "ERROR";
    var title = "VALIDATION ERROR";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Please ensure no files are <strong> duplicated</strong> and contains <strong>value</strong>.");

    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
      disableClose: true,
      data: { action, title, message }
    });

    const duration = 1750;
    setTimeout(() => {
      //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
      dialogRef.close();
    }, duration);
    }
    else if(this.Passed == true) {
      if(this.VatRegistrationChecker == true)
      {
        this.VendorService.VatRegNumberVal(this.CompanyOverviewFormGroup.get('VatRegistrationNumber')?.value).subscribe({next:
          (Result) => {if (Result != null) {
            this.Passed == false;
            var action = "ERROR";
            var title = "VALIDATION ERROR";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an <strong> Vat Registration Number</strong> with the same <strong>Value</strong>.");
        
            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });
        
            const duration = 1750;
            setTimeout(() => {
              //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
              dialogRef.close();
            }, duration);
          }
       }})
      }
      else if(this.LicenseOrAccreditationChecker == true){
        this.VendorService.LicenseNumberVal(this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumber')?.value).subscribe({next:
          (Result) => {if (Result != null) {
            this.Passed == false;
            var action = "ERROR";
            var title = "VALIDATION ERROR";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an <strong>License Or Accreditation Number</strong> with the same <strong>Value</strong>.");
        
            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });
        
            const duration = 1750;
            setTimeout(() => {
              //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
              dialogRef.close();
            }, duration);
          }
       }})
        
      }

      this.VendorService.CompanyRegNumberVal(this.CompanyOverviewFormGroup.get('CompanyRegistrationNumber')?.value).subscribe({next:
        (Result) => {if (Result != null) {
          this.Passed == false;
          var action = "ERROR";
          var title = "VALIDATION ERROR";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an <strong> Company Registration Number</strong> with the same <strong>Value</strong>.");
      
          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });
      
          const duration = 1750;
          setTimeout(() => {
            //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
            dialogRef.close();
          }, duration);
        }
     }})
     this.VendorService.IncomeTaxRegNumberVal(this.CompanyOverviewFormGroup.get('IncomeTaxNumber')?.value).subscribe({next:
      (Result) => {if (Result != null) {
        this.Passed == false;
        var action = "ERROR";
        var title = "VALIDATION ERROR";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("There already exist an <strong> Income Tax Number</strong> with the same <strong>Value</strong>.");
    
        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });
    
        const duration = 1750;
        setTimeout(() => {
          //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
          dialogRef.close();
        }, duration);
      }
   }})
      
      if(this.Passed == true) {
        this.Create()
      }
    }
  }

     VD_ID: 0;

   Create() {
    let test: any
    test = new DatePipe('en-ZA');
    this.VendorDetail.dateAccepted = test.transform(this.VendorDetail.dateAccepted, 'MMM d, y, h:mm:ss a');
    this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value
    this.VendorDetail.contact_Person_Title = this.CompanyContactInfoFormGroup.get("ContactPersonTitle")?.value
    this.VendorDetail.contact_Person_Name = this.CompanyContactInfoFormGroup.get("ContactPersonName")?.value
    this.VendorDetail.contact_Person_ContactNum = this.CompanyContactInfoFormGroup.get("ContactPersonPhone")?.value
    this.VendorDetail.contact_Person_Email = this.CompanyContactInfoFormGroup.get("ContactPersonEmail")?.value
    this.VendorDetail.websiteProvided = this.CompanyWebsiteChecker
    this.VendorDetail.faxProvided = this.CompanyFaxChecker
    this.VendorDetail.registered_Address = this.CompanyContactInfoFormGroup.get("CompanyRegisteredAddress")?.value
    // this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value
    // this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value

    this.VendorDetail.description_GSP = this.CompanyOverviewFormGroup.get("DetailsOfServiceOrGoods")?.value
    this.VendorDetail.registration_Provided = true;
    this.VendorDetail.vatRegistered =  this.VatRegistrationChecker
    this.VendorDetail.income_Tax_Num_Provided = true
    this.VendorDetail.signed_Agreement_Provided = this.SignedAgreementChecker
    this.VendorDetail.insurance_Provided = this.InsuranceCoverChecker
    this.VendorDetail.payment_Terms_Provided = this.PaymentTermsChecker
    this.VendorDetail.license_Num_Provided = this.LicenseOrAccreditationChecker
    
    this.VendorDetail.bank_Name = this.BankDetailsFormGroup.get("BankName")?.value
    this.VendorDetail.branch_Code = this.BankDetailsFormGroup.get("BranchCode")?.value
    this.VendorDetail.account_Holder = this.BankDetailsFormGroup.get("AccountHolder")?.value
    this.VendorDetail.account_Type = this.BankDetailsFormGroup.get("AccountType")?.value
    this.VendorDetail.bank_Account_Number = this.BankDetailsFormGroup.get("AccountNumber")?.value
    this.VendorDetail.bank_Contact_Name = this.BankDetailsFormGroup.get("BankContactName")?.value
    this.VendorDetail.bank_Contact_PhoneNum = this.BankDetailsFormGroup.get("BankContactPhoneNumber")?.value

    this.VendorDetail.vendor_Category_ID = 1;
    this.VendorDetail.vendor_ID = this.Vendor.vendor_ID
    
    this.VendorDetail.beeRegistered = false;
    this.VendorDetail.dueDIllegenceRequired = false
    
    //date that in other tables and files:
    let file:File = this.fileName[6]
        //validate files names-validate tables with number id to check it doesn't exist   
      let FolderCategory = "Bank";
      let VendorNo = "Vendor" + this.Vendor.vendor_ID
      this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
        let Path: any = response
        console.log(response)
        this.VendorDetail.bankStampedConfirtmation = Path.returnedPath.toString();
        
        this.VendorService.AddVendorDetails(this.VendorDetail).subscribe(result =>{
          let VendorList:VendorDetails = result
          
          this.VendorService.UpdateVendorStatus(VendorList[0].vendor_ID,3).subscribe(result => {console.log(result)})


          this.VD_ID = VendorList[0].vendor_Detail_ID
          console.log(this.VD_ID )
          console.log(VendorList)
          if(this.CompanyFaxChecker == true) {
            this.Vendorfax.vendor_Detail_ID = this.VD_ID 
            this.Vendorfax.fax = this.CompanyContactInfoFormGroup.get("CompanyFax")?.value
            this.VendorService.AddFax(this.Vendorfax).subscribe(response => {console.log(response)})
          }
          if(this.VatRegistrationChecker == true) {
            console.log("vat")
            FolderCategory = "VATRegistration";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[1]
            this.VendorVat.vat_Registration_Number = this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.value
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorVat.vaT_Registration_Document = Path.returnedPath.toString();
              this.VendorVat.vendor_Detail_ID = this.VD_ID 
              
              console.log(this.VendorVat)
              this.VendorService.AddVat(this.VendorVat).subscribe(response => {console.log(response)})
            })
            console.log(Path)
          }
          if(this.CompanyWebsiteChecker == true) {
            this.VendorWebsite.url = this.CompanyContactInfoFormGroup.get("CompanyWebsite")?.value
            this.VendorWebsite.vendor_Detail_ID = this.VD_ID 
            this.VendorService.AddWebsite(this.VendorWebsite).subscribe(response => {console.log(response)})
          }
          if(this.LicenseOrAccreditationChecker == true) {
            FolderCategory = "LicenseOrAccreditationNumber";
            let file:File = this.fileName[5]
              VendorNo = "Vendor" + this.Vendor.vendor_ID
              this.VendorLicense.license_No = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                let Path: any = response
                this.VendorLicense.license_Doc_Upload = Path.returnedPath.toString();
                this.VendorLicense.vendor_Detail_ID = this.VD_ID 
                this.VendorLicense.license_No = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value
                this.VendorService.AddLicense(this.VendorLicense).subscribe(response => {console.log(response)})
              })
             
          }
          if(this.SignedAgreementChecker == true) {
            FolderCategory = "SignedAgreement";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[3]
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorAgreement.signed_Agreement_Doc = Path.returnedPath.toString();
              this.VendorAgreement.vendor_Detail_ID = this.VD_ID 
             this.VendorService.AddAgreement(this.VendorAgreement).subscribe(response => {console.log(response)})
            })
            
          }
          if(this.InsuranceCoverChecker == true) {
            FolderCategory = "InsuranceCover";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[4]
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc = Path.returnedPath.toString();
              this.VendorInsurance.vendor_Detail_ID = this.VD_ID 
              this.VendorService.AddInsurance(this.VendorInsurance).subscribe(response => {console.log(response)})
            })
            
          }
          if(this.PaymentTermsChecker == true) {
            this.VendorPaymentTerms.payment_Terms = this.CompanyOverviewFormGroup.get("PaymentTerms")?.value
            this.VendorPaymentTerms.vendor_Detail_ID = this.VD_ID 
            this.VendorService.AddPayTerms(this.VendorPaymentTerms).subscribe(response => {console.log(response)})
          }
          
        
          
          FolderCategory = "RegistrationProof";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[0]
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorRegistration.proof_Of_Registration_Doc = Path.returnedPath.toString();
              this.VendorRegistration.vendor_Detail_ID = this.VD_ID 
              console.log(this.VendorRegistration.vendor_Detail_ID)
              this,this.VendorRegistration.company_Registration_Number = this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.value
              this.VendorService.AddRegistered(this.VendorRegistration).subscribe()
            })
            
        
        
            FolderCategory = "IncomeTax";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            file = this.fileName[2]
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorTax.tax_Clearance_Cert = Path.returnedPath.toString();
              this.VendorTax.vendor_Detail_ID = this.VD_ID 
              console.log(this.VendorTax.vendor_Detail_ID )
              this.VendorTax.income_Tax_Num = this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.value
              this.VendorService.AddIncomeTax(this.VendorTax).subscribe()!
            })
            
            this.VendorService.GetVendorDetailByID(VendorList[0].vendor_Detail_ID).subscribe({
              next: (response) => {
                var action = "CREATED";
                var title = "SUCCESSFULLY CREATED";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Vendor <strong>" + this.Vendor.name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");
        
                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });
        
                 const duration = 1750;
                 setTimeout(() => {
                  this.router.navigate(['/vendor-view'], {queryParams: {refresh: true}});
                  dialogRef.close();
                 }, duration);
              }
            }


            )
        })//adds vendor details

     
      })//creates bank details
     
    

     


  }//create
   
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}