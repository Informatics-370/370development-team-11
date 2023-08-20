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
import { Due_Dillegence } from 'src/app/Shared/DueDillegence';
import { POPI } from 'src/app/Shared/POPI';
import { Vendor_BEE } from 'src/app/Shared/VendorBEE';

import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Vendor_Insurance_Type } from 'src/app/Shared/VendorInsuranceType';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    preferedVendor :false,
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

  VendorInsuranceType:Vendor_Insurance_Type = {
    vendor_Insurance_Type_ID : 4,
    name: "",
    description: "",
  }

  VendorInsurance: Vendor_Insurance = {
    insurance_ID: 0,
    vendor_ID: 0,
    vendor : this.Vendor,
    vendor_Insurance_Type_ID:0,
    vendor_Insurance_Type: this.VendorInsuranceType,
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
  
  DueDilligenceDetails: Due_Dillegence;
  POPIDetails: POPI;
  BeeDetails: Vendor_BEE;
  VendorID:any;
  VenDetails: VendorDetails[] = [];
  FileDetails:any[] = [];
  bValid = false;


  iCanDeleteVen: string = "false";
  canDeleteVen: string;

  iCanEditVen: string = "false";
  canEditVen: string;

  DisplayBool= false;

  ngOnInit(): void {
    this.convertImageToBase64('./assets/Images/CheckMarkBox.png')
    this.convertImageToBase64('./assets/Images/checkboxEmpty.png')
    this.convertLogoToBase64()
    let role = this.VendorService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanDeleteVen = this.VendorService.decodeCanDeleteVen(sessionStorage.getItem("token"));
    this.iCanEditVen = this.VendorService.decodeCanEditVen(sessionStorage.getItem("token"));

    if (role == "GRC") {
      this.canEditVen = "true";
      this.canDeleteVen = "true";
    }

    if (this.iCanEditVen == "true") {
      this.canEditVen = "true";
    }

    if (this.iCanDeleteVen == "true") {
      this.canDeleteVen = "true";
    }


   for(let i = 0;i < 11;i++) {
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
          this.VendorID = this.VendorDetail.vendor_ID
          let test: any
          test = new DatePipe('en-ZA');
          this.VendorDetail.dateAccepted = test.transform(this.VendorDetail.dateAccepted, 'MMM d, y, h:mm:ss a');
          
          let sFilePath = this.VendorDetail.bankStampedConfirtmation
          this.getFileDetails(sFilePath,9)
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
            this.getInsurance(this.VendorID)
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
         
          this.VendorService.GetDueDiligence(this.VendorDetail.vendor_ID).subscribe(response => {
              this.DueDilligenceDetails = response;
              if(this.DueDilligenceDetails.popI_Present == true) {
                this.VendorService.GetPOPI(this.DueDilligenceDetails.due_Diligence_ID).subscribe(value => {
                  this.POPIDetails = value;
                })
              } 
              if(this.DueDilligenceDetails.b_BBEE_Certificate_Provided == true) {
                this.VendorService.GetBEEDetails(this.VendorDetail.vendor_ID).subscribe(value => {
                  this.BeeDetails = value;
                  this.BeeDetails.date = test.transform(this.BeeDetails.date, 'MMM d, y');
                  console.log(this.BeeDetails)
                  let sFilePath = value.beE_Certificate
                  //console.log(sFilePath)
                  this.getFileDetails(sFilePath,10)
                  //console.log(this.BeeDetails)
                })
              }
          })

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
      this.getFileDetails(sFilePath,8)
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

  getInsurance(VendorID:number) {
    this.VendorService.GetInsuranceByID(VendorID).subscribe(result => {
      result.forEach(e=> {
        switch(e.vendor_Insurance_Type_ID) {
          case 1: {
            this.VendorInsurance = e
            let sFilePath = this.VendorInsurance.confirmation_Doc
            this.getFileDetails(sFilePath, 4)
            break;
          }
          case 2: {
            this.VendorInsurance = e
            let sFilePath = this.VendorInsurance.confirmation_Doc
            this.getFileDetails(sFilePath, 5)
            break;
          }
          case 3: {
            this.VendorInsurance = e
            let sFilePath = this.VendorInsurance.confirmation_Doc
            this.getFileDetails(sFilePath, 6)
            break;
          }
          case 4: {
            this.VendorInsurance = e
            let sFilePath = this.VendorInsurance.confirmation_Doc
            this.getFileDetails(sFilePath, 7)
            break;
          }
        }
      })
      
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

  ChangeDisplayOption() {
    if(this.DisplayBool == true) {
      this.DisplayBool = false
    }
    else {
      this.DisplayBool = true
    }
  }

  DeleteRequest(ID: Number) {
    const confirm = this.dialog.open(VendorDeleteComponent, {
      disableClose: true,
      data: { ID }
    });
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }

  boxCheckedTrue:any
boxCheckedFalse:any
logoImageBase64:any;


convertLogoToBase64() {
  let filePath = "./assets/Images/moyo-full-logo2.png";
  const response = fetch(filePath).then((res) => res.blob()).then((blob) => {
    const reader = new FileReader();
    reader.onloadend = () => { 
      this.logoImageBase64 = reader.result   
    };
    reader.readAsDataURL(blob);
});
}

GenerateList() {

  this.VendorService.GetDueDiligence(this.DueDilligenceDetails.vendor_ID).subscribe(result => {
    this.DueDilligenceDetails = result;
  if(this.DueDilligenceDetails.popI_Present == true) {
    this.VendorService.GetPOPI(this.DueDilligenceDetails.due_Diligence_ID).subscribe(response => {
      this.POPIDetails = response;
      let user = this.VendorService.decodeUser(sessionStorage.getItem('token'))
      const docDefinition = {
        info: {
        title:`Due Dilligence Checklist for ${this.DueDilligenceDetails.vendor.name}`,
        },
        content: [
          {table: {
            headerRows: 0,
            widths: [ '*', 'auto' ],
            body: [
              [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 150, height: 50,margin:[5,5,0,5]}, {} ],
            ]
          },
          layout: 'noBorders',margin:[0,0,0,10]},
          { text: 'Vendor Due Diligence Checklist', fontSize: 20, alignment: 'center', color: '#002060', margin: [0, 0, 0, 15] },
          {
            text: 'Created By: ' + user,
            fontSize: 12,
            alignment: 'center',
            bold:true,
          },
          {
            text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            fontSize: 12,
            alignment: 'center',
            bold:true,
          },
          {
            canvas: [
              // Centered line with space above
              { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
            ],
            // Add space above the line
            margin: [0, 10]
          },
          {
          //layout: 'noBorders',
          table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'FOUNDATIONAL DOCUMENTS',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#70ad47'},{text:'',fillColor:'#70ad47'}],
          [{text:'Mutual Non-Disclosure Agreement or Confidentiality Agreement',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.mutual_Nda_Signed), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'Basic Company Information (full legal name,address, physical location, website URL, trading name)',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.basic_Company_Info_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
          [{text:'Ownership structure and affiliated entities (Group structure)',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.group_Structure_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'Income tax number',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.income_Tax_Number_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
          [{text:'VAT number',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.vat_Number_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'Company registration document (CIPC)',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Reg_Doc_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
          [{text:'Letters of good standing COID',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.letter_Of_Good_Standing_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'B-BBEE certificate',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.b_BBEE_Certificate_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
          [{text:'Directors details and ID',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.direcor_Details_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'Company resolution authorising the counter-party to enter into an agreement with Moyo and bind the entity',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Resolution_Agreement_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],]
        },
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length || i === 1) {
                
                return 1;
              }
              else {
                return 0;
              }
              
            },
            vLineWidth: function (i) {
              if (i === 0 || i === 2) {
                return 1;
              }
              else {
                return 0
              }
              
            },
            hLineColor: function (i) {
                return i ? 'black' : '#000000'
         
            },
            vLineColor: function (i) {
                return i ? 'black' : '#000000'
            },
            
          },
          margin:[0,0,0,15],
        },
        {table: {headerRows: 0, 
        widths: ['*','auto'],
        body:[[{text:'FINANCIALS',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#4472c4'},{text:'',fillColor:'#4472c4'}],
        [{text:'VAT registration certificate',fillColor:'#d9e1f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.vat_Reg_Certificate_Provided), width: 10, height: 10,fillColor:'#d9e1f2' }],
        [{text:'Tax clearance certificate',fillColor:'#b4c6e7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.tax_Clearance_Certificate_Provided), width: 10, height: 10,fillColor:'#b4c6e7' }],]
        },
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length || i === 1) {
                
                return 1;
              }
              else {
                return 0;
              }
              
            },
            vLineWidth: function (i) {
              if (i === 0 || i === 2) {
                return 1;
              }
              else {
                return 0
              }
              
            },
            hLineColor: function (i) {
                return i ? 'black' : '#000000'
         
            },
            vLineColor: function (i) {
                return i ? 'black' : '#000000'
            },
            
          },
          margin:[0,0,0,15],
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'SUB-CONTRACTING',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#5b9bd5'},{text:'',fillColor:'#5b9bd5'}],
          [{text:'Name of sub-contractor (company or individual)',fillColor:'#ddebf7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.subcontractor_Name_Provided), width: 10, height: 10,fillColor:'#ddebf7' }],
          [{text:'In case of company, provide similar documents as for main supplier',fillColor:'#bdd7ee'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Details_Provided), width: 10, height: 10,fillColor:'#bdd7ee' }],
          [{text:'In case of individual, provide copy of ID, qualifications, accreditations and professional memberships',fillColor:'#ddebf7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.individual_Details_Provided), width: 10, height: 10,fillColor:'#ddebf7' }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'INSURANCE',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#a5a5a5'},{text:'',fillColor:'#a5a5a5'}],
          [{text:'General liability insurance',fillColor:'#ededed'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.general_Liability_Insurance_Present), width: 10, height: 10,fillColor:'#ededed' }],
          [{text:'Cyber insurance',fillColor:'#dbdbdb'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.cyber_Insurance_Present), width: 10, height: 10,fillColor:'#dbdbdb' }],
          [{text:'Professional indemnity insurance (if applicable)',fillColor:'#ededed'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present), width: 10, height: 10,fillColor:'#ededed' }],
          [{text:'Other specific insurance required per service/industry',fillColor:'#dbdbdb'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.other_Insurance_Required), width: 10, height: 10,fillColor:'#dbdbdb' }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        pageBreak: 'after',
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'LICENSES OR PROFESSIONAL ACCREDITATION',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#44546a'},{text:'',fillColor:'#44546a'}],
          [{text:'Licenses required - (specify and attach copies)',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.licenses_Required), width: 10, height: 10,fillColor:'#d6dce4'  }],
          [{text:'Accreditation required - (specify and attach copies)',fillColor:'#acb9ca'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.accreditation_Required), width: 10, height: 10,fillColor:'#acb9ca'  }],
          [{text:'Professional membership required - (specify and attach copies)',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Membership_Required), width: 10, height: 10,fillColor:'#d6dce4'  }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'INFORMATION SECURITY',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#375623'},{text:'',fillColor:'#375623'}],
          [{text:'Business continuity plan',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.business_Continuity_Present), width: 10, height: 10 ,fillColor:'#a9d08e'}],
          [{text:'Disaster recovery plan',fillColor:'#548235'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.dIsaster_Recovery_Plan_Present), width: 10, height: 10 ,fillColor:'#548235'}],
          [{text:'Protection of personal information by design (use PPI checklist)',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.popI_Present), width: 10, height: 10 ,fillColor:'#a9d08e'}],
          [{text:'History of data breaches and security incidents',fillColor:'#548235'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.data_Security_Breaches_Present), width: 10, height: 10 ,fillColor:'#548235'}],
          [{text:'Site visits to assess security controls (if required)',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.site_Visits_Present), width: 10, height: 10,fillColor:'#a9d08e' }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'POLICY REVIEW',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#808080'},{text:'',fillColor:'#808080'}],
          [{text:'Information security / Data protection policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.information_Security_Policy_Present), width: 10, height: 10 ,fillColor:'#f2f2f2'}],
          [{text:'Privacy policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.privacy_Policy_Present_Present), width: 10, height: 10,fillColor:'#d9d9d9' }],
          [{text:'Data retention and destruction policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.data_Retention_Destruction_Policy_Present), width: 10, height: 10 ,fillColor:'#f2f2f2'}],
          [{text:'Anti-bribery and anti-corruption policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.anti_Bribery_Corruption_Policy_Present), width: 10, height: 10 ,fillColor:'#d9d9d9'}],
          [{text:'Ethics policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.ethics_Policy_Present), width: 10, height: 10,fillColor:'#f2f2f2' }],
          [{text:'Conflict of interest policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.conflict_Of_Interest_Policy_Present), width: 10, height: 10,fillColor:'#d9d9d9' }],
          [{text:'Customer complaints policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.customer_Complaints_Policy_Present), width: 10, height: 10,fillColor:'#f2f2f2' }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
        },
          {table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'BUSINESS REFERENCES',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#44546a'},{text:'',fillColor:'#44546a'}],
          [{text:'Details of at least two business references: Client name and address, Contact person and role in client organisation Contact number,E-mail address',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.business_References_Present), width: 10, height: 10 ,fillColor:'#d6dce4'}],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
        },
        { table: {headerRows: 0,
          widths: ['*','auto'],
          body:[[{text:'Protection of Personal Information Checklist',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#375623'},{text:'',fillColor:'#375623'}],
          [{text:'Does the contract set out what personal data is used for what purpose?',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.POPIDetails.personal_Data_Purpose), width: 10, height: 10,fillColor:'#a9d08e' }],
          [{text:'Is the contracted partner a controller (C), joint controller (JC), processor (P) or sub-processor (SP)?',fillColor:'#e2efda'},{text:this.GetCode(this.POPIDetails.contracted_Partner_Type_ID),fillColor:'#e2efda',fontSize: 10}],
          [{text:'Depending on the controller/processor relationship, do you have a Data Processing Agreement or a Joint Controller Agreement in place?',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.POPIDetails.dataProcessing_JointController_Agreement), width: 10, height: 10,fillColor:'#a9d08e' }],
          [{text:'Does the contract highlight the importance of confidentiality?',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.POPIDetails.confidentiality_Importance_Highlighted), width: 10, height: 10 ,fillColor:'#e2efda'}],
          [{text:'Does the contract provide for audits and inspections?',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.POPIDetails.contract_Audits_Provisions_Provided), width: 10, height: 10 ,fillColor:'#a9d08e'}],
          [{text:'Is it clear who is accountable and liable for different activities?',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.POPIDetails.activity_Liability_Present), width: 10, height: 10,fillColor:'#e2efda' }],
          [{text:'Is there a provision to cover third party processing of data?',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.POPIDetails.third_Party_Data_Processing_Provisioned), width: 10, height: 10,fillColor:'#a9d08e' }],
          [{text:'Does a process exist for managing data when the contract ends?',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.POPIDetails.contract_End_Data_Management_Provided), width: 10, height: 10,fillColor:'#e2efda' }],
          [{text:"Is the personal data that's being processed detailed in your and their 'Record of Processing Activities'?",fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.POPIDetails.personal_Data_Processing_Details_Present), width: 10, height: 10,fillColor:'#a9d08e' }],
          [{text:'Does the supplier hold any form of certification for their processing activities?',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.POPIDetails.processing_Activities_Certification_Held), width: 10, height: 10,fillColor:'#e2efda' }],]
        },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
        },
      ]
        
        
      };
     
      pdfMake.createPdf(docDefinition).open();
      } ) 
  }
  else{
    let user = this.VendorService.decodeUser(sessionStorage.getItem('token'))
    const docDefinition = {
      info: {
        title:`Due Dilligence Checklist for ${this.DueDilligenceDetails.vendor.name}`,
        },
      content: [
        {table: {
          headerRows: 0,
          widths: [ '*', 'auto' ],
          body: [
            [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 150, height: 50,margin:[5,5,0,5]}, {} ],
          ]
        },
        layout: 'noBorders',margin:[0,0,0,10]},
        { text: 'Vendor Due Diligence Checklist', fontSize: 20, alignment: 'center', color: '#002060', margin: [0, 0, 0, 15] },
        {
          text: 'Created By: ' + user,
          fontSize: 12,
          alignment: 'center',
          bold:true,
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
          bold:true,
        },
        {
          canvas: [
            // Centered line with space above
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
          ],
          // Add space above the line
          margin: [0, 10]
        },
        {
        
        table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'FOUNDATIONAL DOCUMENTS',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#70ad47'},{text:'',fillColor:'#70ad47'}],
        [{text:'Mutual Non-Disclosure Agreement or Confidentiality Agreement',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.mutual_Nda_Signed), width: 10, height: 10 ,fillColor:'#e2efda'}],
        [{text:'Basic Company Information (full legal name,address, physical location, website URL, trading name)',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.basic_Company_Info_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
        [{text:'Ownership structure and affiliated entities (Group structure)',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.group_Structure_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
        [{text:'Income tax number',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.income_Tax_Number_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
        [{text:'VAT number',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.vat_Number_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
        [{text:'Company registration document (CIPC)',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Reg_Doc_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
        [{text:'Letters of good standing COID',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.letter_Of_Good_Standing_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
        [{text:'B-BBEE certificate',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.b_BBEE_Certificate_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],
        [{text:'Directors details and ID',fillColor:'#e2efda'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.direcor_Details_Provided), width: 10, height: 10 ,fillColor:'#e2efda'}],
        [{text:'Company resolution authorising the counter-party to enter into an agreement with Moyo and bind the entity',fillColor:'#c6e0b4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Resolution_Agreement_Provided), width: 10, height: 10 ,fillColor:'#c6e0b4'}],]
      },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
      },
      {table: {headerRows: 0, 
      widths: ['*','auto'],
      body:[[{text:'FINANCIALS',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#4472c4'},{text:'',fillColor:'#4472c4'}],
      [{text:'VAT registration certificate',fillColor:'#d9e1f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.vat_Reg_Certificate_Provided), width: 10, height: 10,fillColor:'#d9e1f2' }],
      [{text:'Tax clearance certificate',fillColor:'#b4c6e7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.tax_Clearance_Certificate_Provided), width: 10, height: 10,fillColor:'#b4c6e7' }],]
      },
        layout: {
          hLineWidth: function (i, node) {
            if (i === 0 || i === node.table.body.length || i === 1) {
              
              return 1;
            }
            else {
              return 0;
            }
            
          },
          vLineWidth: function (i) {
            if (i === 0 || i === 2) {
              return 1;
            }
            else {
              return 0
            }
            
          },
          hLineColor: function (i) {
              return i ? 'black' : '#000000'
       
          },
          vLineColor: function (i) {
              return i ? 'black' : '#000000'
          },
          
        },
        margin:[0,0,0,15],
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'SUB-CONTRACTING',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#5b9bd5'},{text:'',fillColor:'#5b9bd5'}],
        [{text:'Name of sub-contractor (company or individual)',fillColor:'#ddebf7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.subcontractor_Name_Provided), width: 10, height: 10,fillColor:'#ddebf7' }],
        [{text:'In case of company, provide similar documents as for main supplier',fillColor:'#bdd7ee'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.company_Details_Provided), width: 10, height: 10,fillColor:'#bdd7ee' }],
        [{text:'In case of individual, provide copy of ID, qualifications, accreditations and professional memberships',fillColor:'#ddebf7'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.individual_Details_Provided), width: 10, height: 10,fillColor:'#ddebf7' }],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      margin:[0,0,0,15],
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'INSURANCE',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#a5a5a5'},{text:'',fillColor:'#a5a5a5'}],
        [{text:'General liability insurance',fillColor:'#ededed'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.general_Liability_Insurance_Present), width: 10, height: 10,fillColor:'#ededed' }],
        [{text:'Cyber insurance',fillColor:'#dbdbdb'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.cyber_Insurance_Present), width: 10, height: 10,fillColor:'#dbdbdb' }],
        [{text:'Professional indemnity insurance (if applicable)',fillColor:'#ededed'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present), width: 10, height: 10,fillColor:'#ededed' }],
        [{text:'Other specific insurance required per service/industry',fillColor:'#dbdbdb'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.other_Insurance_Required), width: 10, height: 10,fillColor:'#dbdbdb' }],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      pageBreak: 'after',
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'LICENSES OR PROFESSIONAL ACCREDITATION',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#44546a'},{text:'',fillColor:'#44546a'}],
        [{text:'Licenses required - (specify and attach copies)',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.licenses_Required), width: 10, height: 10,fillColor:'#d6dce4'  }],
        [{text:'Accreditation required - (specify and attach copies)',fillColor:'#acb9ca'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.accreditation_Required), width: 10, height: 10,fillColor:'#acb9ca'  }],
        [{text:'Professional membership required - (specify and attach copies)',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Membership_Required), width: 10, height: 10,fillColor:'#d6dce4'  }],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'INFORMATION SECURITY',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#375623'},{text:'',fillColor:'#375623'}],
        [{text:'Business continuity plan',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.business_Continuity_Present), width: 10, height: 10 ,fillColor:'#a9d08e'}],
        [{text:'Disaster recovery plan',fillColor:'#548235'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.dIsaster_Recovery_Plan_Present), width: 10, height: 10 ,fillColor:'#548235'}],
        [{text:'Protection of personal information by design (use PPI checklist)',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.popI_Present), width: 10, height: 10 ,fillColor:'#a9d08e'}],
        [{text:'History of data breaches and security incidents',fillColor:'#548235'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.data_Security_Breaches_Present), width: 10, height: 10 ,fillColor:'#548235'}],
        [{text:'Site visits to assess security controls (if required)',fillColor:'#a9d08e'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.site_Visits_Present), width: 10, height: 10,fillColor:'#a9d08e' }],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      margin:[0,0,0,15],
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'POLICY REVIEW',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#808080'},{text:'',fillColor:'#808080'}],
        [{text:'Information security / Data protection policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.information_Security_Policy_Present), width: 10, height: 10 ,fillColor:'#f2f2f2'}],
        [{text:'Privacy policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.privacy_Policy_Present_Present), width: 10, height: 10,fillColor:'#d9d9d9' }],
        [{text:'Data retention and destruction policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.data_Retention_Destruction_Policy_Present), width: 10, height: 10 ,fillColor:'#f2f2f2'}],
        [{text:'Anti-bribery and anti-corruption policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.anti_Bribery_Corruption_Policy_Present), width: 10, height: 10 ,fillColor:'#d9d9d9'}],
        [{text:'Ethics policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.ethics_Policy_Present), width: 10, height: 10,fillColor:'#f2f2f2' }],
        [{text:'Conflict of interest policy',fillColor:'#d9d9d9'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.conflict_Of_Interest_Policy_Present), width: 10, height: 10,fillColor:'#d9d9d9' }],
        [{text:'Customer complaints policy',fillColor:'#f2f2f2'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.customer_Complaints_Policy_Present), width: 10, height: 10,fillColor:'#f2f2f2' }],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      margin:[0,0,0,15],
      },
        {table: {headerRows: 0,
        widths: ['*','auto'],
        body:[[{text:'BUSINESS REFERENCES',fontSize: 16,alignment: 'center',color: '#ffffff',fillColor:'#44546a'},{text:'',fillColor:'#44546a'}],
        [{text:'Details of at least two business references: Client name and address, Contact person and role in client organisation Contact number,E-mail address',fillColor:'#d6dce4'},{image:this.CheckBoxSelection(this.DueDilligenceDetails.business_References_Present), width: 10, height: 10 ,fillColor:'#d6dce4'}],]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length || i === 1) {
            
            return 1;
          }
          else {
            return 0;
          }
          
        },
        vLineWidth: function (i) {
          if (i === 0 || i === 2) {
            return 1;
          }
          else {
            return 0
          }
          
        },
        hLineColor: function (i) {
            return i ? 'black' : '#000000'
     
        },
        vLineColor: function (i) {
            return i ? 'black' : '#000000'
        },
        
      },
      margin:[0,0,0,15],
      },
    ]
      
      
    };
    pdfMake.createPdf(docDefinition).open();
  }

  })
}
  



GetCode(i:number) {
  switch(i) {
    case 1: {
      return "(C)";
      break;
    }
    case 2: { 
     return "(JC)";
     break;
    }
    case 3: {
      return "(P)";
      break;
    }
    default: {
      return "(SP)";
      break;
    }
  }
}

CheckBoxSelection(TOF:boolean) {
  if(TOF == true) {
    return this.boxCheckedTrue
  }
  else {
    return this.boxCheckedFalse
  }
}

convertImageToBase64(filePath: string) {
  const response = fetch(filePath).then((res) => res.blob()).then((blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if(filePath == "./assets/Images/CheckMarkBox.png") {
          this.boxCheckedTrue = reader.result
        }
        else {
          this.boxCheckedFalse = reader.result
        }
        
    };
    reader.readAsDataURL(blob);
});
}


}

