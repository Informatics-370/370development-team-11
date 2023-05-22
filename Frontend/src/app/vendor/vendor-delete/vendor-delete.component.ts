import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Vendor_Category } from 'src/app/Shared/VendorCategory';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { Vendor_Fax } from 'src/app/Shared/VendorDetailsFax';
import { Vendor_Tax } from 'src/app/Shared/VendorDetailsIncomeTaxNum';
import { Vendor_Insurance } from 'src/app/Shared/VendorDetailsInsurance';
import { Vendor_License } from 'src/app/Shared/VendorDetailsLicense';
import { Vendor_Payment_Terms } from 'src/app/Shared/VendorDetailsPaymentTerms';
import { Vendor_Registration } from 'src/app/Shared/VendorDetailsRegistration';
import { Vendor_Agreement } from 'src/app/Shared/VendorDetailsSignedAgreement';
import { Vendor_Vat } from 'src/app/Shared/VendorDetailsVatRegistered';
import { Vendor_Website } from 'src/app/Shared/VendorDetailsWebsite';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { VendorStatus } from 'src/app/Shared/VendorStatus';

@Component({
  selector: 'app-vendor-delete',
  templateUrl: './vendor-delete.component.html',
  styleUrls: ['./vendor-delete.component.css']
})
export class VendorDeleteComponent {

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
    sole_Supplier_Provided:false,
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
    vat_Registration_Number: 0,
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
    license_No: 0,
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
    income_Tax_Num: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    tax_Clearance_Cert:"",
  }

  VendorRegistration  : Vendor_Registration = {
    company_Registration_Number: 0,
    vendor_Detail_ID: 0,
    vendor_Detail: this.VendorDetail,
    proof_Of_Registration_Doc:"",
  }

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;
  FileDetails:any[] = [];
  constructor(public dialogRef: MatDialogRef<VendorDeleteComponent>, private router: Router, private ActRoute: ActivatedRoute, private route: Router, private VendorService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }
//create api backend 1 for get and one for delete 
OnboardRequestDetails: any[] = [];
    ngOnInit(): void {
      for(let i = 0;i < 7;i++) {
        this.FileDetails.push({FileName:""})
      }
      this.ActRoute.paramMap.subscribe({
        next: (params) => {
          const ID = this.data.ID;
          console.log(ID);
  
          if (ID) {
            this.VendorService.GetVendorDetailByID(ID).subscribe(result => {
               this.VendorDetail = result
               this.Vendor = this.VendorDetail.vendor
                console.log(this.VendorDetail.vendor)

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

              this.getFileDetails(this.VendorDetail.bankStampedConfirtmation,6)
              console.log(this.FileDetails)
              

            });//result
            
          }//dataservice
        }//if
      })//next
    };//actroute

 


//add loop
  onConfirm(VendorDetailsId: number): void {
    let FolderCategory = ""
    let VendorNo = ""
    let fileName = ""

    
      


    console.log(this.Vendorfax)
    if(this.VendorDetail.faxProvided == true ) {
      this.VendorService.DeleteFaxByID(this.Vendorfax.fax_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.vatRegistered == true) {
      
      FolderCategory = "VATRegistration";
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      fileName =  this.FileDetails[1].FileName
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteVatByID(this.VendorVat.vat_Registration_Number).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.websiteProvided == true) {
      this.VendorService.DeleteWebsiteByID(this.VendorWebsite.website_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.license_Num_Provided == true) {
      FolderCategory = "LicenseOrAccreditationNumber";
      fileName =  this.FileDetails[5].FileName
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteLicenseByID(this.VendorLicense.vendor_Detail_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.signed_Agreement_Provided == true) {

      FolderCategory = "SignedAgreement";
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      fileName =  this.FileDetails[3].FileName
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteAgreementByID(this.VendorAgreement.agreement_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.insurance_Provided == true) {
      FolderCategory = "InsuranceCover";
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      fileName =  this.FileDetails[4].FileName
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteInsuranceByID(this.VendorInsurance.insurance_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.payment_Terms_Provided == true) {
      this.VendorService.DeletePaymentTerms(this.VendorPaymentTerms.payment_Terms_ID).subscribe(response => {console.log(response)})
    }    
    if(this.VendorDetail.income_Tax_Num_Provided == true) {
      FolderCategory = "IncomeTax";
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      fileName =  this.FileDetails[2].FileName
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteIncomeTaxByID(this.VendorTax.vendor_Detail_ID).subscribe(response => {console.log(response)})
    }
    if(this.VendorDetail.registration_Provided == true) {
      FolderCategory = "RegistrationProof";
      VendorNo = "Vendor" + this.Vendor.vendor_ID
      fileName =  this.FileDetails[0].FileName
      this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
      this.VendorService.DeleteRegistrationByID(this.VendorRegistration.vendor_Detail_ID).subscribe(response => {console.log(response)})
    } 
    this.FinalDelete();
       
    }

    FinalDelete() {
    let  FolderCategory = "Bank";
    let  VendorNo = "Vendor" + this.Vendor.vendor_ID 
    let  fileName =  this.FileDetails[6].FileName
    this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,fileName).subscribe()!
    this.VendorService.DeleteVendorDetails(this.VendorDetail.vendor_Detail_ID).subscribe({
      next:(response) => { 
        this.VendorService.UpdateVendorStatus(this.VendorDetail.vendor_ID,2).subscribe(result => {console.log(result)})
       this.showConfirmationDialog = false;
      this.showSuccessDialog = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/vendor-view'], {queryParams: {refresh: true}});
      }, 1750);
    }
    })
    }

    onCancel(): void {
      this.dialogRef.close();
    }



    getFax(FaxID:number) {
      console.log(FaxID)
      this.VendorService.GetFaxByID(FaxID).subscribe(result => {
      this.Vendorfax = result
    })
    }
    
    getVat(VatID:number) {
     this.VendorService.GetVatByID(VatID).subscribe(result => {
     this.VendorTax = result
     let sFilePath = this.VendorTax.tax_Clearance_Cert
     this.getFileDetails(sFilePath,1)
    })
    }
    
    getWebsite(WebsiteID:number) {
     this.VendorService.GetWebsiteByID(WebsiteID).subscribe(result => {
     this.VendorWebsite = result
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

    getFileDetails(sPath:string,ID:number) {
      let FolderCategory = sPath.substring(0,sPath.indexOf("\\"))
      sPath = sPath.substring(sPath.indexOf("\\")+1,sPath.length)
      let VendorNo = sPath.substring(0,sPath.indexOf("\\"))
      let filename = sPath.substring(sPath.indexOf("\\")+1,sPath.length)
      this.FileDetails[ID].FileName = filename
  }
  
   
  }

  





