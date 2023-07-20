import { Component, OnInit, } from '@angular/core';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { Vendor_Category } from 'src/app/Shared/VendorCategory';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor_Fax } from 'src/app/Shared/VendorDetailsFax';
import { Vendor_Vat } from 'src/app/Shared/VendorDetailsVatRegistered';
import { Vendor_Website } from 'src/app/Shared/VendorDetailsWebsite';
import { Vendor_License } from 'src/app/Shared/VendorDetailsLicense';
import { Vendor_Agreement } from 'src/app/Shared/VendorDetailsSignedAgreement';
import { Vendor_Insurance } from 'src/app/Shared/VendorDetailsInsurance';
import { Vendor_Payment_Terms } from 'src/app/Shared/VendorDetailsPaymentTerms';
import { Vendor_Tax } from 'src/app/Shared/VendorDetailsIncomeTaxNum';
import { Vendor_Registration } from 'src/app/Shared/VendorDetailsRegistration';
import { VendorDeleteComponent } from '../vendor-delete/vendor-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-vendordetails-view',
  templateUrl: './vendordetails-view.component.html',
  styleUrls: ['./vendordetails-view.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})


export class VendordetailsViewComponent implements OnInit {


  constructor(private VendorService: DataService, private route: ActivatedRoute,private router: Router, private dialog: MatDialog) { }

  

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
    dateAccepted:new Date('en-ZA'),
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
  
  VenDetails: VendorDetails[] = [];
  FileDetails:any[] = [];
  ngOnInit(): void {



   for(let i = 0;i < 7;i++) {
      this.FileDetails.push({FileURL:"",FileName:""})
   }
   console.log(this.FileDetails)
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorDetailID = paramater.get("VendorID");
        this.VendorService.GetVendorDetailByID(Number(VendorDetailID)).subscribe(result => {
          if(result == null) {
            
          }
          this.VendorDetail = result
          let test: any
          test = new DatePipe('en-ZA');
          this.VendorDetail.dateAccepted = test.transform(this.VendorDetail.dateAccepted, 'MMM d, y, h:mm:ss a');
          
          let sFilePath = this.VendorDetail.bankStampedConfirtmation
          this.getFileDetails(sFilePath,6)
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
    })
    }})

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
    this.VendorService.GetFaxByID(FaxID).subscribe(result => {
      this.Vendorfax = result
      
    })
  }
  
  getVat(VatID:number) {
    this.VendorService.GetVatByID(VatID).subscribe(result => {
      
      this.VendorVat = result
      let sFilePath = this.VendorVat.vaT_Registration_Document
      console.log(this.VendorVat.vaT_Registration_Document)
      this.getFileDetails(sFilePath,1)
    })
  }

  getWebsite(WebsiteID:number) {
    this.VendorService.GetWebsiteByID(WebsiteID).subscribe(result => {
      this.VendorWebsite = result
      console.log( this.VendorWebsite)
    })
  }

  getLicense(LicenseID:number) {
    this.VendorService.GetLicenseByID(LicenseID).subscribe(result => {
      this.VendorLicense = result
      let sFilePath = this.VendorLicense.license_Doc_Upload
      this.getFileDetails(sFilePath,5)
    })
  }

  getAgreement(AgreementID:number) {
    this.VendorService.GetAgreementByID(AgreementID).subscribe(result => {
      console.log(result)
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
    })
  }

  getRegistration(RegistrationID:number) {
    this.VendorService.GetRegistrationByID(RegistrationID).subscribe(result => {
      this.VendorRegistration = result
      let sFilePath = this.VendorRegistration.proof_Of_Registration_Doc
      this.getFileDetails(sFilePath,0)
    })
  }
  getIncomeTax(IncomeTaxID:number) {
    this.VendorService.GetIncomeTaxByID(IncomeTaxID).subscribe(result => {
      this.VendorTax = result
      let sFilePath = this.VendorTax.tax_Clearance_Cert
      this.getFileDetails(sFilePath,2)
    })
  }


  DeleteRequest(ID: Number) {
    const confirm = this.dialog.open(VendorDeleteComponent, {
      disableClose: true,
      data: { ID }
    });
  }


}

