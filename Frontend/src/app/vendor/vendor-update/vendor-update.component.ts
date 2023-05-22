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

@Component({
  selector: 'app-vendor-update',
  templateUrl: './vendor-update.component.html',
  styleUrls: ['./vendor-update.component.css']
})
export class VendorUpdateComponent {

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
    CompanyRegistrationNumberDoc: '',
    VatRegistrationCheck: false,
    VatRegistrationNumber: ['',Validators.pattern(/^[0-9]*$/)],
    VatRegistrationNumberDoc: null,
    IncomeTaxNumber: ['', [Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^[0-9]*$/)]],
    IncomeTaxNumberDoc: '',
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
    BankStampedConfirmationLetter:'',
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
        console.log(this.fileName)
        // let stest:File = event.target.files[0];
        // console.log(stest)
     }

  FileDetails:any[] = [];
  VD_ID:any;
  ngOnInit(): void {

    for(let i = 0;i < 7;i++) {
      this.FileDetails.push({FileURL:"",FileName:""})
    }
    console.log(this.fileName)
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorDetailID = paramater.get("VendorID");
        
        this.VendorService.GetVendorDetailByID(Number(VendorDetailID)).subscribe(result => {
          this.VendorDetail = result
          let sFilePath = this.VendorDetail.bankStampedConfirtmation
          this.VendorService.GetVendorByID(Number(this.VendorDetail.vendor_ID)).subscribe(result => {
            this.Vendor = result
            this.VendorDetail.vendor_ID == this.Vendor.vendor_ID
            this.CompanyContactInfoFormGroup.get('CompanyName')?.setValue(this.Vendor.name);
            this.CompanyContactInfoFormGroup.get('CompanyName').disable()
            this.CompanyContactInfoFormGroup.get('CompanyEmail')?.setValue(this.Vendor.email);
            this.CompanyContactInfoFormGroup.get('CompanyEmail').disable()

          })
          this.Vendorfax.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorVat.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorWebsite.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorLicense.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorAgreement.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorInsurance.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorRegistration.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.VendorTax.vendor_Detail_ID = this.VendorDetail.vendor_Detail_ID
          this.getFileDetails(sFilePath,6)
          this.VD_ID = this.VendorDetail.vendor_Detail_ID;
          console.log(this.VD_ID)
          console.log(this.VendorDetail.vendor_Detail_ID)  
          if(this.VendorDetail.faxProvided == true ) {
            this.getFax(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.vatRegistered == true) {
            this.getVat(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.websiteProvided == true) {
            this.getWebsite(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.license_Num_Provided == true) {
            this.getLicense(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.signed_Agreement_Provided == true) {
            this.getAgreement(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.insurance_Provided == true) {
            this.getInsurance(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.payment_Terms_Provided == true) {
            this.getPaymentTerms(this.VendorDetail.vendor_Detail_ID)
          }
          if(this.VendorDetail.registration_Provided == true) {
            this.getRegistration(this.VendorDetail.vendor_Detail_ID)
          }     
          if(this.VendorDetail.income_Tax_Num_Provided == true) {
            this.getIncomeTax(this.VendorDetail.vendor_Detail_ID)
          }

          this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.setValue(this.VendorDetail.telephone_Num)
          this.CompanyContactInfoFormGroup.get("ContactPersonTitle")?.setValue(this.VendorDetail.contact_Person_Title)
          this.CompanyContactInfoFormGroup.get("ContactPersonPhone")?.setValue(this.VendorDetail.bank_Contact_PhoneNum)
          this.CompanyContactInfoFormGroup.get("ContactPersonEmail")?.setValue(this.VendorDetail.contact_Person_Email)
          this.CompanyContactInfoFormGroup.get("ContactPersonName")?.setValue(this.VendorDetail.contact_Person_Name)
          this.CompanyContactInfoFormGroup.get("CompanyRegisteredAddress")?.setValue(this.VendorDetail.registered_Address)
          this.CompanyWebsiteChecker = this.VendorDetail.websiteProvided
          this.CompanyContactInfoFormGroup.get("CompanyWebsiteCheck")?.setValue(this.VendorDetail.websiteProvided)
          this.CompanyFaxChecker = this.VendorDetail.faxProvided
          this.CompanyContactInfoFormGroup.get("CompanyFaxCheck")?.setValue(this.VendorDetail.faxProvided)
          
          this.CompanyOverviewFormGroup.get("DetailsOfServiceOrGoods")?.setValue(this.VendorDetail.description_GSP)
          
          this.CompanyOverviewFormGroup.get("VatRegistrationCheck")?.setValue(this.VendorDetail.vatRegistered)
          this.VatRegistrationChecker = this.VendorDetail.vatRegistered
          this.CompanyOverviewFormGroup.get("SignedAgreementCheck")?.setValue(this.VendorDetail.signed_Agreement_Provided)
          this.SignedAgreementChecker = this.VendorDetail.signed_Agreement_Provided
          this.CompanyOverviewFormGroup.get("InsuranceCoverCheck")?.setValue(this.VendorDetail.insurance_Provided )
          this.InsuranceCoverChecker = this.VendorDetail.insurance_Provided 
          this.CompanyOverviewFormGroup.get("PaymentTermsCheck")?.setValue(this.VendorDetail.payment_Terms_Provided)
          this.PaymentTermsChecker = this.VendorDetail.payment_Terms_Provided
          this.CompanyOverviewFormGroup.get("LicenseOrAccreditationCheck")?.setValue(this.VendorDetail.license_Num_Provided)
          this.LicenseOrAccreditationChecker = this.VendorDetail.license_Num_Provided 
   
          this.BankDetailsFormGroup.get("BankName")?.setValue(this.VendorDetail.bank_Name)
          this.BankDetailsFormGroup.get("BranchCode")?.setValue(this.VendorDetail.branch_Code)
          this.BankDetailsFormGroup.get("AccountHolder")?.setValue(this.VendorDetail.account_Holder)
          this.BankDetailsFormGroup.get("AccountType")?.setValue(this.VendorDetail.account_Type)
          this.BankDetailsFormGroup.get("AccountNumber")?.setValue(this.VendorDetail.bank_Account_Number)
          this.BankDetailsFormGroup.get("BankContactName")?.setValue(this.VendorDetail.bank_Contact_Name)
          this.BankDetailsFormGroup.get("BankContactPhoneNumber")?.setValue(this.VendorDetail.bank_Contact_PhoneNum)
          this.VendorDetail.vendor_Category_ID = 1;
         
          this.CompanyWebsiteChange();
          this.CompanyFaxChange();
          this.VatRegistrationChange();
          this.SignedAgreementChange();
          this.InsuranceCoverChange();
          this.PaymentTermsChange();
          this.LicenseOrAccreditationChange();
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

      if (this.VendorDetail.vatRegistered == false) {
        this.CompanyOverviewFormGroup.get('VatRegistrationNumberDoc')?.addValidators(Validators.required)
      }

      this.CompanyOverviewFormGroup.get('VatRegistrationNumber')?.addValidators(Validators.required)
      this.CompanyOverviewFormGroup.get('VatRegistrationNumber')?.enable()
      this.CompanyOverviewFormGroup.get('VatRegistrationNumberDoc')?.enable()
    }
    else {
      this.CompanyOverviewFormGroup.get('VatRegistrationNumber')?.disable();

      this.CompanyOverviewFormGroup.get('VatRegistrationNumberDoc')?.disable();
      
    }
   }

    SignedAgreementChange() {
      this.SignedAgreementChecker = this.CompanyOverviewFormGroup.get("SignedAgreementCheck")?.value
      if(this.SignedAgreementChecker == true) {
        if (this.VendorDetail.signed_Agreement_Provided == false) {
        this.CompanyOverviewFormGroup.get('SignedAgreementDoc')?.addValidators(Validators.required)
        }
        this.CompanyOverviewFormGroup.get('SignedAgreementDoc')?.enable()
      }
      else if(this.SignedAgreementChecker == false) {
        this.CompanyOverviewFormGroup.get('SignedAgreementDoc')?.disable();   
      }
    }

    InsuranceCoverChange() {
      this.InsuranceCoverChecker = this.CompanyOverviewFormGroup.get("InsuranceCoverCheck")?.value
      console.log(this.InsuranceCoverChecker)
      if(this.InsuranceCoverChecker == true ) {
        if (this.VendorDetail.insurance_Provided == false) {
        this.CompanyOverviewFormGroup.get('InsuranceCoverDoc')?.addValidators(Validators.required)
        }
        this.CompanyOverviewFormGroup.get('InsuranceCoverDoc')?.enable()
        
      }
      else {
        this.CompanyOverviewFormGroup.get('InsuranceCoverDoc')?.disable();   
      }
    }

    PaymentTermsChange() {
      this.PaymentTermsChecker = this.CompanyOverviewFormGroup.get("PaymentTermsCheck")?.value
      if(this.PaymentTermsChecker == true) {
        this.CompanyOverviewFormGroup.get('PaymentTerms')?.addValidators(Validators.required)
        this.CompanyOverviewFormGroup.get('PaymentTerms')?.enable()
      }
      else {
        this.CompanyOverviewFormGroup.get('PaymentTerms')?.disable();   
      }
    }

    LicenseOrAccreditationChange() {
      this.LicenseOrAccreditationChecker = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationCheck")?.value
      console.log(this.LicenseOrAccreditationChecker)
      if(this.LicenseOrAccreditationChecker == true) {
       
        if (this.VendorDetail.license_Num_Provided == false) {
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumberDoc')?.addValidators(Validators.required)
        }
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumber')?.addValidators(Validators.required)
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumber')?.enable()
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumberDoc')?.enable()
      }
      else {
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumber')?.disable();
  
        this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumberDoc')?.disable();
        
      }
     }
 

     Passed: boolean = true
     Validate() {
       this.Passed = true
       for(let a = 0; a < this.fileName.length;a++) {
         for(let b = 0;b<this.fileName.length;b++) {
           if ((this.fileName[a].name != undefined && this.fileName[a].name == this.fileName[b].name && a != b) || (this.fileName[a].size == 0)) {
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
        console.log(Number(this.CompanyOverviewFormGroup.get('CompanyRegistrationNumber')?.value))
        if(this.VendorVat.vat_Registration_Number != this.CompanyOverviewFormGroup.get('VatRegistrationNumber')?.value)
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
        console.log(this.VendorRegistration.company_Registration_Number)
        console.log(Number(this.CompanyOverviewFormGroup.get('CompanyRegistrationNumber')?.value))
        if(this.VendorRegistration.company_Registration_Number != this.CompanyOverviewFormGroup.get('CompanyRegistrationNumber')?.value){
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
        }
        
        if(this.VendorLicense.license_No != this.CompanyOverviewFormGroup.get('LicenseOrAccreditationNumber')?.value){
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
        
        if(this.VendorTax.income_Tax_Num != this.CompanyOverviewFormGroup.get('IncomeTaxNumber')?.value){
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
        }

        if (this.Passed == true) {
          
          this.Create()
        }


         
       }
     }//validation



   Create() {
    //normale date
    this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value
    this.VendorDetail.contact_Person_Title = this.CompanyContactInfoFormGroup.get("ContactPersonTitle")?.value
    this.VendorDetail.contact_Person_Name = this.CompanyContactInfoFormGroup.get("ContactPersonName")?.value
    this.VendorDetail.contact_Person_ContactNum = this.CompanyContactInfoFormGroup.get("ContactPersonPhone")?.value
    this.VendorDetail.contact_Person_Email = this.CompanyContactInfoFormGroup.get("ContactPersonEmail")?.value
    this.VendorDetail.websiteProvided = this.CompanyWebsiteChecker
    this.VendorDetail.faxProvided = this.CompanyFaxChecker
    this.VendorDetail.registered_Address = this.CompanyContactInfoFormGroup.get("CompanyRegisteredAddress")?.value
    this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value
    this.VendorDetail.telephone_Num = this.CompanyContactInfoFormGroup.get("CompanyTelphone")?.value

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

    
    this.VendorDetail.vendor_ID = this.Vendor.vendor_ID
    
    this.VendorDetail.beeRegistered = false;
    this.VendorDetail.dueDIllegenceRequired = false
    this.VendorDetail.vendor = this.Vendor
    this.VendorDetail.vendor_Category = this.vendorCat
    this.VendorDetail.vendor_Category_ID = 1; 
    this.VendorDetail.vendor_ID = this.Vendor.vendor_ID
    //date that in other tables and files:
   
        //validate files names-validate tables with number id to check it doesn't exist   
      let FolderCategory = "Bank";
      let VendorNo = "Vendor" + this.Vendor.vendor_ID
      console.log(this.VendorDetail)
      if(this.BankDetailsFormGroup.get("BankStampedConfirmationLetter")?.value != "") {
      
        let fileName =  this.FileDetails[6].FileName
        this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe(Response => {console.log(Response)})

        let file:File = this.fileName[6]
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
        let Path: any = response
        console.log(response)
        this.VendorDetail.bankStampedConfirtmation = Path.returnedPath.toString();
     
        this.VendorService.UpdateVendorDetails(this.VD_ID,this.VendorDetail).subscribe(result =>{
          let VendorList:VendorDetails = result
          
          this.VD_ID = VendorList.vendor_Detail_ID
          this.CreateContinue(this.VD_ID)
          console.log(this.VD_ID )
          console.log(VendorList)
        })//update vendor details

     
        })//bank details
      }
      else {
       
        console.log(this.VD_ID)
        this.VendorService.UpdateVendorDetails(this.VD_ID,this.VendorDetail).subscribe(result =>{
          let VendorList:VendorDetails = result
          console.log(this.VD_ID )
          this.VD_ID = VendorList.vendor_Detail_ID
          this.CreateContinue(this.VD_ID)
          console.log(this.VD_ID )
          console.log(VendorList)
        })//update vendor details
      }
          
          
        
    // this.router.navigate(['/vendor-view'], {queryParams: {refresh: true}});
      

  }//create
   
CreateContinue(VenDetailsID:number) {
  let FolderCategory = "";
      let VendorNo = "";

  this.Vendorfax.vendor_Detail = this.VendorDetail
          console.log(this.VD_ID)
          console.log(this.VendorDetail.vendor_Detail_ID)
          if(this.CompanyFaxChecker == true && this.Vendorfax.fax_ID == 0 ) {
            console.log(this.VendorDetail.vendor_Detail_ID)
            this.Vendorfax.vendor_Detail_ID = this.VD_ID 
            this.Vendorfax.fax = this.CompanyContactInfoFormGroup.get("CompanyFax")?.value
            this.VendorService.AddFax(this.Vendorfax).subscribe(response => {console.log(response)})
          }
          else if(this.CompanyFaxChecker == true && this.Vendorfax.fax != this.CompanyContactInfoFormGroup.get("CompanyFax")?.value){
            this.Vendorfax.fax = this.CompanyContactInfoFormGroup.get("CompanyFax")?.value
            this.VendorService.UpdateFax(this.Vendorfax.fax_ID,this.Vendorfax).subscribe(response => 
              {
                console.log("success")
              })
          }
          else if(this.Vendorfax.fax_ID != 0 && this.CompanyFaxChecker == false) {
            this.VendorService.DeleteFaxByID(this.Vendorfax.fax_ID).subscribe(response => {console.log(response)})
          }//fax
         
          this.VendorVat.vendor_Detail = this.VendorDetail
          if(this.VatRegistrationChecker == true && this.VendorVat.vat_Registration_Number == "" ) {
            console.log("vat")
            FolderCategory = "VATRegistration";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[1]
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorVat.vaT_Registration_Document = Path.returnedPath.toString();
              this.VendorVat.vendor_Detail_ID = this.VD_ID 
              this.VendorVat.vat_Registration_Number = this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.value
              console.log(this.VendorVat)
              this.VendorService.AddVat(this.VendorVat).subscribe(response => {console.log(response)})
            })
            
          }
          else if(this.VatRegistrationChecker == true && (this.VendorVat.vat_Registration_Number != this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.value || this.fileName[1] != "" && this.fileName[1] != undefined)) {
            FolderCategory = "VATRegistration";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[1].FileName
            this.VendorVat.vendor_Detail_ID = this.VD_ID 
            
            if(this.VendorVat.vat_Registration_Number == this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.value) {
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName)!
              let file:File = this.fileName[1]
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorVat.vaT_Registration_Document = Path.returnedPath.toString(); 
              this.VendorService.UpdateVat(this.VendorDetail.vendor_Detail_ID,this.VendorVat).subscribe()
              })
            }
            else {
              this.VendorService.DeleteVatByID(this.VendorVat.vendor_Detail_ID).subscribe(response => {
                this.VendorVat = response
                this.VendorVat.vendor_Detail = this.VendorDetail
                this.VendorVat.vat_Registration_Number =  this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.value
                if(this.fileName[1] != "" && this.fileName[1] != undefined) {
                  let file:File = this.fileName[1]
                  this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
                  this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                  let Path: any = response
                  this.VendorVat.vaT_Registration_Document = Path.returnedPath.toString(); 
                  this.VendorService.AddVat(this.VendorVat).subscribe()
                 })
                }
                else {
                  this.VendorService.AddVat(this.VendorVat).subscribe()
                }
                
              })
            }

            
          } 
          else if(this.VatRegistrationChecker == false && this.VendorVat.vat_Registration_Number != "") {
            FolderCategory = "VATRegistration";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[1].FileName
            this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe({next: (Response) => {
              this.VendorService.DeleteVatByID(this.VendorDetail.vendor_Detail_ID).subscribe(response => {console.log(response)})
            }})
            
          }//vatRegistered

          this.VendorWebsite.vendor_Detail = this.VendorDetail
          if(this.CompanyWebsiteChecker == true && this.VendorWebsite.website_ID == 0  ) {
            this.VendorWebsite.url = this.CompanyContactInfoFormGroup.get("CompanyWebsite")?.value
            this.VendorWebsite.vendor_Detail_ID = this.VD_ID 
            this.VendorService.AddWebsite(this.VendorWebsite).subscribe(response => {console.log(response)})
          }
          else if (this.CompanyWebsiteChecker == true && this.VendorWebsite.url != this.CompanyContactInfoFormGroup.get("CompanyWebsite")?.value) {
            this.VendorWebsite.url = this.CompanyContactInfoFormGroup.get("CompanyWebsite")?.value
            this.VendorService.UpdateWebsite(this.VendorWebsite.website_ID,this.VendorWebsite).subscribe(response => 
              {
                console.log("success")
              })
          }
          else if(this.CompanyWebsiteChecker == false && this.VendorWebsite.website_ID != 0) {
            this.VendorService.DeleteWebsiteByID(this.VendorWebsite.website_ID).subscribe(response => {console.log(response)})
          }//website

          this.VendorLicense.vendor_Detail = this.VendorDetail
          if(this.LicenseOrAccreditationChecker == true && this.VendorLicense.license_No == "" ) {
            console.log(this.fileName[5])
            this.VendorLicense.license_No = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value
            console.log(this.VendorLicense.license_No)
            FolderCategory = "LicenseOrAccreditationNumber";
            let file:File = this.fileName[5]
              VendorNo = "Vendor" + this.Vendor.vendor_ID
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                let Path: any = response
                this.VendorLicense.license_Doc_Upload = Path.returnedPath.toString();
                this.VendorLicense.vendor_Detail_ID = this.VD_ID 
                this.VendorLicense.license_No = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value
                this.VendorService.AddLicense(this.VendorLicense).subscribe(response => {console.log(response)})
              })
             
          } 
          else if(this.LicenseOrAccreditationChecker == true && (this.VendorLicense.license_No != this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value || this.fileName[5] != "" && this.fileName[5] != undefined)) {
            FolderCategory = "LicenseOrAccreditationNumber";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[5].FileName
            
            if(this.VendorLicense.license_No == this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value) {
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName)!
              let file:File = this.fileName[5]
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorLicense.license_Doc_Upload = Path.returnedPath.toString(); 
              this.VendorLicense.vendor_Detail_ID = this.VD_ID
              this.VendorService.UpdateLicense(this.VendorLicense.vendor_Detail_ID,this.VendorLicense).subscribe()
              })
            }
            else {
              
              this.VendorService.DeleteLicenseByID(this.VendorVat.vendor_Detail_ID).subscribe(response => {
                this.VendorLicense = response
                this.VendorLicense.vendor_Detail = this.VendorDetail
                this.VendorLicense.license_No = this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.value
                if(this.fileName[5] != "" && this.fileName[5] != undefined) {
                  let file:File = this.fileName[5]
                  this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
                  this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                  let Path: any = response
                  this.VendorLicense.license_Doc_Upload = Path.returnedPath.toString(); 
                  this.VendorService.AddLicense(this.VendorLicense).subscribe()
                 })
                }
                else {
                  this.VendorService.AddLicense(this.VendorLicense).subscribe()
                }
                
              })
              
            }
          }
          else if(this.LicenseOrAccreditationChecker == false && this.VendorLicense.license_No != "") {
            FolderCategory = "LicenseOrAccreditationNumber";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[5].FileName
            this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe({next: (Response) => {
              this.VendorService.DeleteLicenseByID(this.VendorLicense.vendor_Detail_ID).subscribe(response => {console.log(response)})
            }})

            
            
          }//lisense
          this.VendorAgreement.vendor_Detail = this.VendorDetail
          if(this.SignedAgreementChecker == true && this.VendorAgreement.agreement_ID == 0 ) {
            FolderCategory = "SignedAgreement";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let file:File = this.fileName[3]  
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorAgreement.signed_Agreement_Doc = Path.returnedPath.toString();
              this.VendorAgreement.vendor_Detail_ID = this.VD_ID 
              console.log(this.VendorAgreement)
             this.VendorService.AddAgreement(this.VendorAgreement).subscribe(response => {console.log(response)})
            })
            
          }
          else if(this.SignedAgreementChecker == true && this.fileName[3] != ""  && this.fileName[3] != undefined){
            FolderCategory = "SignedAgreement";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[3].FileName
            if(this.fileName[3] != "" && this.fileName[3] != undefined) {
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName)!
              let file:File = this.fileName[3]
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorAgreement.signed_Agreement_Doc = Path.returnedPath.toString(); 
              this.VendorAgreement.vendor_Detail_ID = this.VD_ID
              this.VendorService.UpdateAgreement(this.VendorAgreement.agreement_ID,this.VendorAgreement).subscribe(response => 
                {
                  console.log("success")
                })
              })
            }
          }
          else if(this.SignedAgreementChecker == false && this.VendorAgreement.agreement_ID != 0) {
            FolderCategory = "SignedAgreement";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[3].FileName  
            this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe({next: (Response) => {
              this.VendorService.DeleteAgreementByID(this.VendorAgreement.agreement_ID).subscribe(response => {console.log(response)})
            }})
           
          }//signedagreement

          this.VendorInsurance.vendor_Detail = this.VendorDetail
          if(this.InsuranceCoverChecker == true && this.VendorInsurance.insurance_ID == 0 ) {
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
          else if(this.InsuranceCoverChecker == true && this.fileName[4] != "" && this.fileName[4] != undefined) {
            FolderCategory = "InsuranceCover";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[4].FileName
            if(this.fileName[4] != "" && this.fileName[4] != undefined) {
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName)!
              let file:File = this.fileName[4]
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc = Path.returnedPath.toString(); 
              this.VendorInsurance.vendor_Detail_ID = this.VD_ID
              this.VendorService.UpdateInsurance(this.VendorInsurance.insurance_ID,this.VendorInsurance).subscribe(response => 
                {
                  console.log("success")
                })
              })
            }
          }
          else if(this.InsuranceCoverChecker == false && this.VendorInsurance.insurance_ID != 0){
            FolderCategory = "InsuranceCover";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[4].FileName
            this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe({next: (Response) => {
              this.VendorService.DeleteInsuranceByID(this.VendorInsurance.insurance_ID).subscribe(response => {console.log(response)})
            }})
          }//insurance
          
          this.VendorPaymentTerms.vendor_Detail = this.VendorDetail
          if(this.PaymentTermsChecker == true && this.VendorPaymentTerms.payment_Terms_ID == 0 ) {
            this.VendorPaymentTerms.payment_Terms = this.CompanyOverviewFormGroup.get("PaymentTerms")?.value
            this.VendorPaymentTerms.vendor_Detail_ID = this.VD_ID 
            this.VendorService.AddPayTerms(this.VendorPaymentTerms).subscribe(response => {console.log(response)})
          }
          else if(this.PaymentTermsChecker == true && this.VendorPaymentTerms.payment_Terms != this.CompanyOverviewFormGroup.get("PaymentTerms")?.value) {
            this.VendorPaymentTerms.payment_Terms = this.CompanyOverviewFormGroup.get("PaymentTerms")?.value
            this.VendorService.UpdatePayTerms(this.VendorPaymentTerms.payment_Terms_ID,this.VendorPaymentTerms).subscribe(response => 
              {
                console.log("success")
              })
          }
          else if(this.PaymentTermsChecker == false && this.VendorPaymentTerms.payment_Terms_ID != 0) {
            this.VendorService.DeletePaymentTerms(this.VendorPaymentTerms.payment_Terms_ID).subscribe(response => {console.log(response)})
          }//payment terms  

       

          if(this.VendorRegistration.company_Registration_Number != this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.value || (this.fileName[0] != "" && this.fileName[0] != undefined)) {
           // this.VendorRegistration.company_Registration_Number = Number(this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.value)
            FolderCategory = "RegistrationProof";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[0].FileName
            this.VendorRegistration.vendor_Detail = this.VendorDetail
            this.VendorRegistration.vendor_Detail_ID = this.VD_ID
            if(this.VendorRegistration.company_Registration_Number == this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.value) {
              let file:File = this.fileName[0]
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorRegistration.proof_Of_Registration_Doc = Path.returnedPath.toString(); 
              this.VendorService.UpdateRegistered(this.VendorRegistration.vendor_Detail_ID,this.VendorRegistration).subscribe()!
              })
            }
            else {
              this.VendorService.DeleteRegistrationByID(this.VendorRegistration.vendor_Detail_ID).subscribe(response => {
                this.VendorRegistration = response
                this.VendorRegistration.vendor_Detail = this.VendorDetail
                this.VendorRegistration.company_Registration_Number = this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.value
                if(this.fileName[0] != "" && this.fileName[0] != undefined) {
                  let file:File = this.fileName[0]
                  this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
                  this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                  let Path: any = response
                  this.VendorRegistration.proof_Of_Registration_Doc = Path.returnedPath.toString(); 
                  this.VendorService.AddRegistered(this.VendorRegistration).subscribe()
                 })
                }
                else {
                  this.VendorService.AddRegistered(this.VendorRegistration).subscribe()
                }
                
              })
              
          
              
            }
          }//vendorregistration 
          console.log(this.VendorTax.income_Tax_Num)
          console.log(Number(this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.value))
          console.log(this.fileName[2])
          if((this.VendorTax.income_Tax_Num != this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.value) || (this.fileName[2] != "" && this.fileName[2] != undefined)) {
            
            FolderCategory = "IncomeTax";
            VendorNo = "Vendor" + this.Vendor.vendor_ID
            let fileName =  this.FileDetails[2].FileName
            this.VendorTax.vendor_Detail = this.VendorDetail
            if(this.VendorTax.income_Tax_Num == this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.value) {
              let file:File = this.fileName[2]
              this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
              let Path: any = response
              this.VendorTax.tax_Clearance_Cert = Path.returnedPath.toString(); 
              this.VendorTax.vendor_Detail_ID = this.VD_ID
              this.VendorService.UpdateIncomeTax(this.VendorTax.vendor_Detail_ID,this.VendorTax).subscribe()!
              })
            }
            else {
              this.VendorService.DeleteIncomeTaxByID(this.VendorTax.vendor_Detail_ID).subscribe(response => {
                this.VendorTax = response
                this.VendorTax.vendor_Detail = this.VendorDetail
                this.VendorTax.income_Tax_Num = this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.value
                if(this.fileName[2] != "" && this.fileName[2] != undefined) {
                  let file:File = this.fileName[2]
                  this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()
                  this.VendorService.VendorFileAdd(FolderCategory,VendorNo,file).subscribe(response => {
                  let Path: any = response
                  this.VendorTax.tax_Clearance_Cert = Path.returnedPath.toString(); 
                  this.VendorService.AddIncomeTax(this.VendorTax).subscribe()
                 })
                }
                else {
                  this.VendorService.AddIncomeTax(this.VendorTax).subscribe()
                }
                
              })
              
            }
            }//taxincome    
            
            this.VendorService.GetVendorDetailByID(this.VendorDetail.vendor_Detail_ID).subscribe({
              next: (response) => {
                var action = "UPDATED";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Vendor <strong>" + this.Vendor.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");
        
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
            })

}



  getFileDetails(sPath:string,ID:number) {
    let FolderCategory = sPath.substring(0,sPath.indexOf("\\"))
    sPath = sPath.substring(sPath.indexOf("\\")+1,sPath.length)
    let VendorNo = sPath.substring(0,sPath.indexOf("\\"))
    let filename = sPath.substring(sPath.indexOf("\\")+1,sPath.length)
    this.FileDetails[ID].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}` 
    this.FileDetails[ID].FileName = filename
}

getFax(FaxID:number) {
  console.log(FaxID)
this.VendorService.GetFaxByID(FaxID).subscribe(result => {
this.Vendorfax = result
this.CompanyContactInfoFormGroup.get("CompanyFax")?.setValue(this.Vendorfax.fax)

})
}

getVat(VatID:number) {
this.VendorService.GetVatByID(VatID).subscribe(result => {
this.VendorVat = result
let sFilePath = this.VendorVat.vaT_Registration_Document
this.getFileDetails(sFilePath,1)
this.CompanyOverviewFormGroup.get("VatRegistrationNumber")?.setValue(this.VendorVat.vat_Registration_Number.toString())
})
}

getWebsite(WebsiteID:number) {
this.VendorService.GetWebsiteByID(WebsiteID).subscribe(result => {
this.VendorWebsite = result
this.CompanyContactInfoFormGroup.get("CompanyWebsite")?.setValue(this.VendorWebsite.url)
})
}

getLicense(LicenseID:number) {
this.VendorService.GetLicenseByID(LicenseID).subscribe(result => {
this.VendorLicense = result
let sFilePath = this.VendorLicense.license_Doc_Upload
this.getFileDetails(sFilePath,5)
this.CompanyOverviewFormGroup.get("LicenseOrAccreditationNumber")?.setValue(this.VendorLicense.license_No.toString())
})
}

getAgreement(AgreementID:number) {
this.VendorService.GetAgreementByID(AgreementID).subscribe(result => {
this.VendorAgreement = result
let sFilePath = this.VendorAgreement.signed_Agreement_Doc
this.getFileDetails(sFilePath,3)
})
}

getInsurance(InsuranceID:number) {
this.VendorService.GetInsuranceByID(InsuranceID).subscribe(result => {
this.VendorInsurance = result
let sFilePath = this.VendorInsurance.confirmation_Doc
this.getFileDetails(sFilePath,4)
})
}

getPaymentTerms(PaymentTermsID:number) {
this.VendorService.GetPaymentTerms(PaymentTermsID).subscribe(result => {
this.VendorPaymentTerms = result
this.CompanyOverviewFormGroup.get("PaymentTerms")?.setValue(this.VendorPaymentTerms.payment_Terms)
})
}

getRegistration(RegistrationID:number) {
this.VendorService.GetRegistrationByID(RegistrationID).subscribe(result => {
this.VendorRegistration = result
let sFilePath = this.VendorRegistration.proof_Of_Registration_Doc
this.getFileDetails(sFilePath,0)
this.CompanyOverviewFormGroup.get("CompanyRegistrationNumber")?.setValue(this.VendorRegistration.company_Registration_Number.toString())
})
}
getIncomeTax(IncomeTaxID:number) {
this.VendorService.GetIncomeTaxByID(IncomeTaxID).subscribe(result => {
this.VendorTax = result
let sFilePath = this.VendorTax.tax_Clearance_Cert
this.getFileDetails(sFilePath,2)
this.CompanyOverviewFormGroup.get("IncomeTaxNumber")?.setValue(this.VendorTax.income_Tax_Num.toString())
})
}


   
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}