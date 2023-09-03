import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Vendor_BEE } from 'src/app/Shared/VendorBEE';
import { DatePipe } from '@angular/common';
import { Due_Dillegence } from 'src/app/Shared/DueDillegence';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { POPI } from 'src/app/Shared/POPI';
import { Contracted_Partner_Type } from 'src/app/Shared/ContractedPartnerType';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { Vendor_Insurance_Type } from 'src/app/Shared/VendorInsuranceType';
import { Vendor_Insurance } from 'src/app/Shared/VendorDetailsInsurance';
import { AuditLog } from 'src/app/Shared/AuditLog';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { filter } from 'rxjs';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-vendor-approve-edit',
  templateUrl: './vendor-approve-edit.component.html',
  styleUrls: ['./vendor-approve-edit.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class VendorApproveEditComponent implements OnInit{

  matcher = new MyErrorStateMatcher()
  minDate: Date;

  constructor(private _formBuilder: FormBuilder,private VendorService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

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
    preferedVendor:false,
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

  VenBEEDetails:Vendor_BEE = {
    beE_ID: 0,
    vendor_ID:0,
    vendor: this.Vendor,
    beE_Level:0,
    beE_Certificate:'',
    date:new Date(),
  };

  DueDilligenceDetails: Due_Dillegence = {
    due_Diligence_ID:0,
    vendor_ID:0,
    vendor: this.Vendor,
    due_Diligence_Doc: false,
    mutual_Nda_Signed: false,
    basic_Company_Info_Provided: false,
    group_Structure_Provided: false,
    income_Tax_Number_Provided: false,
    tax_Clearance_Certificate_Provided: false,
    vat_Number_Provided: false,
    vat_Reg_Certificate_Provided: false,
    company_Reg_Doc_Provided: false,
    letter_Of_Good_Standing_Provided: false,
    b_BBEE_Certificate_Provided: false,
    direcor_Details_Provided: false,
    company_Resolution_Agreement_Provided: false,
    subcontractor_Name_Provided: false,
    company_Details_Provided: false,
    individual_Details_Provided: false,
    general_Liability_Insurance_Present: false,
    cyber_Insurance_Present: false,
    proffesional_Indemnity_Insurance_Present:false,
    other_Insurance_Required: false,
    licenses_Required: false,
    accreditation_Required:false,
    proffesional_Membership_Required: false,
    business_Continuity_Present: false,
    dIsaster_Recovery_Plan_Present: false,
    popI_Present: false,
    data_Security_Breaches_Present: false,
    site_Visits_Present:false,
    information_Security_Policy_Present: false,
    privacy_Policy_Present_Present: false,
    data_Retention_Destruction_Policy_Present: false,
    anti_Bribery_Corruption_Policy_Present: false,
    ethics_Policy_Present: false,
    conflict_Of_Interest_Policy_Present: false,
    customer_Complaints_Policy_Present: false,
    business_References_Present: false,
    bank_Stamped_Confirtmation:false,
  };

  ContractedPartnerTypeDetails: Contracted_Partner_Type = {
    contracted_Partner_Type_ID:1,
    name:'',
    description:'',
  };

  POPIDetails: POPI = {
    pOPI_ID:0,
    contracted_Partner_Type_ID:1,
    due_Diligence_ID:0,
    due_Dillegence: this.DueDilligenceDetails,
    contracted_Partner_Type: this.ContractedPartnerTypeDetails,
    personal_Data_Purpose: false,
    dataProcessing_JointController_Agreement: false,
    confidentiality_Importance_Highlighted: false,
    contract_Audits_Provisions_Provided: false,
    activity_Liability_Present: false,
    third_Party_Data_Processing_Provisioned: false,
    contract_End_Data_Management_Provided: false,
    personal_Data_Processing_Details_Present: false,
    processing_Activities_Certification_Held: false,
  };


  DueDiligenceChecklistDetailsFormGroup = this._formBuilder.group({
    HasDDC:false,
  });

  FoundationaldocumentsFormGroup = this._formBuilder.group({
    MutualNDA: false,
    BasicCompanyInfo:[false,[Validators.requiredTrue]],
    GroupStructure: false,
    IncomeTaxNumber: [false,[Validators.requiredTrue]],
    VatNumber:false,
    CIPC: false,
    LetterofGoodStanding: false,
    BBBEECertificate: false,
    DirectorsInfo: false,
    CompanyResolutionAgreement: false,
    BEELevel: 0,
    BEECertificateDoc:[''],
    BEEValidatityDate:[Date.now(),[Validators.required]],
  });


  FinancialsFormGroup = this._formBuilder.group({
    VATRegistrationCertificate: false,
    TaxClearanceCertificate: false,
    bank_Stamped_Confirtmation:false,
  });

  SubContractingFormGroup = this._formBuilder.group({
    NameSubContractor: false,
    CompanyDetails: false,
    IndividualDetails: false,
  });

  InsuranceFormGroup = this._formBuilder.group({
    GeneralLiabilityInsurance: false,
    CyberInsurance: false,
    ProfessionalIndemnityInsurance: false,
    OtherInsurance: false,
    GeneralLiabilityInsuranceDoc: "",
    CyberInsuranceDoc:"",
    ProfessionalIndemnityInsuranceDoc:"",
    OtherInsuranceDoc:"",
  });

  LicensesOrProfessionalAccreditationFormGroup = this._formBuilder.group({
    LicensesRequired: false,
    AccreditationRequired: false,
    ProfessionalMembershipRequired: false,
  });

  InformationSecurityFormGroup = this._formBuilder.group({
    BusinessContinuityPlan: false,
    DisasterRecoveryPlan: false,
    POPI: false,
    DataSecurityBreachesPresent:false,
    SiteVisitsPresent:false,
    Personal_Data_Purpose: [false,[Validators.requiredTrue]],
    Contracted_Partner_Type_ID:1,
    DataProcessing_JointController_Agreement: [false,[Validators.requiredTrue]],
    Confidentiality_Importance_Highlighted:[false,[Validators.requiredTrue]],
    Contract_Audits_Provisions_Provided:[false,[Validators.requiredTrue]],
    Activity_Liability_Present:[false,[Validators.requiredTrue]],
    Third_Party_Data_Processing_Provisioned:[false,[Validators.requiredTrue]],
    Contract_End_Data_Management_Provided:[false,[Validators.requiredTrue]],
    Personal_Data_Processing_Details_Present:[false,[Validators.requiredTrue]],
    Processing_Activities_Certification_Held:[false,[Validators.requiredTrue]],
  });

 

  PolicyReviewFormGroup = this._formBuilder.group({
    InformationSecurityPolicyPresent: false,
    PrivacyPolicyPresentPresent: false,
    DataRetentionDestructionPolicyPresent: false,
    AntiBriberyCorruptionPolicyPresent:false,
    EthicsPolicyPresent:false,
    ConflictOfInterestPolicyPresent:false,
    CustomerComplaintsPolicyPresent:false,
  });

  BusinessReferencesFormGroup = this._formBuilder.group({
    BusinessReferencesPresent: false,
  });

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  
  FileDetails:any = [];
  DueDilligenceData:any;
  ngOnInit() {
    const currentYear = new Date().getFullYear()
   const currentmonth = new Date().getMonth();
   const currentDay = new Date().getDate();
   this.minDate = new Date(currentYear - 1, currentmonth, currentDay+1);
    this.FoundationaldocumentsFormGroup.get("BEELevel").setValue(1);
    this.FoundationaldocumentsFormGroup.get("BEELevel")?.disable();
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.disable();
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc")?.disable();
    for(let i = 0;i < 5;i++) {
      this.FileDetails.push({FileURL:"",FileName:""})
    }
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorID = paramater.get("VendorID");
        this.VendorService.GetDueDiligence(Number(VendorID)).subscribe(element => {
          
          this.DueDilligenceData = element
          this.DueDiligenceChecklistDetailsFormGroup.get("HasDDC")?.setValue(element.due_Diligence_Doc)

          this.FoundationaldocumentsFormGroup.get("MutualNDA")?.setValue(element.mutual_Nda_Signed)
          this.FoundationaldocumentsFormGroup.get("BasicCompanyInfo")?.setValue(element.basic_Company_Info_Provided)
          this.FoundationaldocumentsFormGroup.get("GroupStructure")?.setValue(element.group_Structure_Provided)
          this.FoundationaldocumentsFormGroup.get("IncomeTaxNumber")?.setValue(element.income_Tax_Number_Provided)
          this.FoundationaldocumentsFormGroup.get("VatNumber")?.setValue(element.vat_Number_Provided)
          this.FoundationaldocumentsFormGroup.get("CIPC")?.setValue(element.company_Reg_Doc_Provided)
          this.FoundationaldocumentsFormGroup.get("LetterofGoodStanding")?.setValue(element.letter_Of_Good_Standing_Provided)
          this.FoundationaldocumentsFormGroup.get("BBBEECertificate")?.setValue(element.b_BBEE_Certificate_Provided)
          //this.DueDilligenceDetails.b_BBEE_Certificate_Provided = element.b_BBEE_Certificate_Provided
          this.BEEChecked = element.b_BBEE_Certificate_Provided
          this.FoundationaldocumentsFormGroup.get("DirectorsInfo")?.setValue(element.direcor_Details_Provided )
          this.FoundationaldocumentsFormGroup.get("CompanyResolutionAgreement")?.setValue(element.company_Resolution_Agreement_Provided)
          //financials
      this.FinancialsFormGroup.get("VATRegistrationCertificate")?.setValue(element.vat_Reg_Certificate_Provided)
      this.FinancialsFormGroup.get("TaxClearanceCertificate")?.setValue(element.tax_Clearance_Certificate_Provided)
      this.FinancialsFormGroup.get("bank_Stamped_Confirtmation")?.setValue(element.bank_Stamped_Confirtmation)
      //subcontracting
      this.SubContractingFormGroup.get("NameSubContractor")?.setValue(element.subcontractor_Name_Provided)
      this.SubContractingFormGroup.get("CompanyDetails")?.setValue(element.company_Details_Provided)
      this.SubContractingFormGroup.get("IndividualDetails")?.setValue(element.individual_Details_Provided)

      //insurnace
      this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.setValue(element.general_Liability_Insurance_Present)
      this.InsuranceFormGroup.get("CyberInsurance")?.setValue(element.cyber_Insurance_Present)
      this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.setValue(element.proffesional_Indemnity_Insurance_Present)
      this.InsuranceFormGroup.get("OtherInsurance")?.setValue(element.other_Insurance_Required)

      this.VendorService.GetInsuranceByID(Number(VendorID)).subscribe(result => {
       let requestlist:any = result;
       requestlist.forEach(e => {
          if(e.vendor_Insurance_Type_ID == 1) {
            let sFile = e.confirmation_Doc;
            let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            this.FileDetails[1].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
            this.FileDetails[1].FileName = filename
          }
          else if(e.vendor_Insurance_Type_ID == 2) {
            let sFile = e.confirmation_Doc;
            let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            this.FileDetails[2].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
            this.FileDetails[2].FileName = filename
          }
          else if(e.vendor_Insurance_Type_ID == 3) {
            let sFile = e.confirmation_Doc;
            let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            this.FileDetails[3].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
            this.FileDetails[3].FileName = filename
          }
          else if(e.vendor_Insurance_Type_ID == 4) {
            let sFile = e.confirmation_Doc;
            let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            this.FileDetails[4].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
            this.FileDetails[4].FileName = filename
          }
        })

      })

      //licensesorprofessional
      this.LicensesOrProfessionalAccreditationFormGroup.get("LicensesRequired")?.setValue(element.licenses_Required )
      this.LicensesOrProfessionalAccreditationFormGroup.get("AccreditationRequired")?.setValue(element.accreditation_Required)
      this.LicensesOrProfessionalAccreditationFormGroup.get("ProfessionalMembershipRequired")?.setValue(element.proffesional_Membership_Required )

      //information security
      this.InformationSecurityFormGroup.get("BusinessContinuityPlan")?.setValue(element.business_Continuity_Present)
      this.InformationSecurityFormGroup.get("DisasterRecoveryPlan")?.setValue(element.dIsaster_Recovery_Plan_Present)
     // this.InformationSecurityFormGroup.get("POPI")?.setValue(element.pOPI_Present)
      this.POPIChecked = element.popI_Present
      this.InformationSecurityFormGroup.get("DataSecurityBreachesPresent")?.setValue(element.data_Security_Breaches_Present)
      this.InformationSecurityFormGroup.get("SiteVisitsPresent")?.setValue(element.site_Visits_Present)

      //Policy Review
      this.PolicyReviewFormGroup.get("InformationSecurityPolicyPresent")?.setValue(element.information_Security_Policy_Present )
      this.PolicyReviewFormGroup.get("PrivacyPolicyPresentPresent")?.setValue(element.privacy_Policy_Present_Present)
      this.PolicyReviewFormGroup.get("DataRetentionDestructionPolicyPresent")?.setValue(element.data_Retention_Destruction_Policy_Present)
      this.PolicyReviewFormGroup.get("AntiBriberyCorruptionPolicyPresent")?.setValue(element.anti_Bribery_Corruption_Policy_Present)
      this.PolicyReviewFormGroup.get("EthicsPolicyPresent")?.setValue(element.ethics_Policy_Present)
      this.PolicyReviewFormGroup.get("ConflictOfInterestPolicyPresent")?.setValue(element.conflict_Of_Interest_Policy_Present )
      this.PolicyReviewFormGroup.get("CustomerComplaintsPolicyPresent")?.setValue(element.customer_Complaints_Policy_Present)

      //business references
      this.BusinessReferencesFormGroup.get("BusinessReferencesPresent")?.setValue(element.business_References_Present)

          if(element.popI_Present == true) {
            this.VendorService.GetPOPI(element.due_Diligence_ID).subscribe(response => {
              this.POPIDetails = response
              if(this.POPIChecked == true) {
                this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID")?.setValue(response.contracted_Partner_Type_ID)
                this.InformationSecurityFormGroup.get("Personal_Data_Purpose")?.setValue(response.personal_Data_Purpose)
                this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement")?.setValue(response.dataProcessing_JointController_Agreement)
                this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted")?.setValue(response.confidentiality_Importance_Highlighted)
                this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided")?.setValue(response.contract_Audits_Provisions_Provided)
                this.InformationSecurityFormGroup.get("Activity_Liability_Present")?.setValue(response.activity_Liability_Present)
                this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned")?.setValue(response.third_Party_Data_Processing_Provisioned) 
                this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided")?.setValue(response.contract_End_Data_Management_Provided)
                this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present")?.setValue(response.personal_Data_Processing_Details_Present)
                this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held")?.setValue(response.processing_Activities_Certification_Held)
              }  

            })
          }
          else {
            this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").setValue(1);
            this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").disable();
            this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").disable();
            this.InformationSecurityFormGroup.get("Personal_Data_Purpose").disable();
            //this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").disable();
            this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement").disable();
            this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted").disable();
            this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided").disable();
            this.InformationSecurityFormGroup.get("Activity_Liability_Present").disable();
            this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned").disable();
            this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided").disable();
            this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present").disable();
            this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held").disable();
          }
          if(element.b_BBEE_Certificate_Provided == true) {
            this.VendorService.GetBEEDetails(Number(VendorID)).subscribe(response => {
              this.VenBEEDetails = response //Number(VendorID)
              if(this.BEEChecked == true) {
                this.FoundationaldocumentsFormGroup.get("BEELevel")?.enable();
                this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.enable();
                this.FoundationaldocumentsFormGroup.get("BEECertificateDoc")?.enable();
                
                this.FoundationaldocumentsFormGroup.get("BEELevel")?.setValue(response.beE_Level);
                this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.setValue(response.date);
                let sFile = response.beE_Certificate;
                let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
                sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
                let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
                let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
                this.FileDetails[0].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
                this.FileDetails[0].FileName = filename
              }
            })
          }

       

        })
      }
    }
    )}//ngomt

    stepIndex:any;

  setFocus(stepper: MatStepper) {
    if(stepper != null) {
      
      setTimeout(() => {
        document.getElementById(stepper.selectedIndex.toString()).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
        //this.setFocus(stepper)
        }, 150);
    }
      
    
    
    
    //this.setFocus(stepper)
  }
  

POPIChecked = false;

onPOPIChecked(stepper: MatStepper) {
  
  if(this.POPIChecked == false) {
    this.POPIChecked = true;
    this.setFocus(stepper)
    this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").setValue(1);
    this.InformationSecurityFormGroup.get("Personal_Data_Purpose").enable();
    this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").enable();
    this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement").enable();
    this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted").enable();
    this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided").enable();
    this.InformationSecurityFormGroup.get("Activity_Liability_Present").enable();
    this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned").enable();
    this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided").enable();
    this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present").enable();
    this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held").enable();

    this.InformationSecurityFormGroup.get("Personal_Data_Purpose").invalid
  }
  else if(this.POPIChecked == true) 
  {
    this.POPIChecked = false;
    this.InformationSecurityFormGroup.get("Personal_Data_Purpose").disable();
    //this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").disable();
    this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement").disable();
    this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted").disable();
    this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided").disable();
    this.InformationSecurityFormGroup.get("Activity_Liability_Present").disable();
    this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned").disable();
    this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided").disable();
    this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present").disable();
    this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held").disable();
  }

  this.validationLinear()
}

onInsuranceChecked() {
  if(this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value == true && this.FileDetails[1].FileName == "") {
    this.InsuranceFormGroup.get("GeneralLiabilityInsuranceDoc")?.addValidators(Validators.required)
    this.InsuranceFormGroup.get("GeneralLiabilityInsuranceDoc")?.enable();
  }
  else {
    this.InsuranceFormGroup.get("GeneralLiabilityInsuranceDoc")?.disable();
  }

  if(this.InsuranceFormGroup.get("CyberInsurance")?.value == true && this.FileDetails[2].FileName == "") {
    this.InsuranceFormGroup.get("CyberInsuranceDoc")?.addValidators(Validators.required)
    this.InsuranceFormGroup.get("CyberInsuranceDoc")?.enable();
  }
  else {
    this.InsuranceFormGroup.get("CyberInsuranceDoc")?.disable();
  }

  if(this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value == true && this.FileDetails[3].FileName == "") {
    this.InsuranceFormGroup.get("ProfessionalIndemnityInsuranceDoc")?.addValidators(Validators.required)
    this.InsuranceFormGroup.get("ProfessionalIndemnityInsuranceDoc")?.enable();
  }
  else {
    this.InsuranceFormGroup.get("ProfessionalIndemnityInsuranceDoc")?.disable();
  }

  if(this.InsuranceFormGroup.get("OtherInsurance")?.value == true && this.FileDetails[4].FileName == "") {
    this.InsuranceFormGroup.get("OtherInsuranceDoc")?.addValidators(Validators.required)
    this.InsuranceFormGroup.get("OtherInsuranceDoc")?.enable();
  }
  else {
    this.InsuranceFormGroup.get("OtherInsuranceDoc")?.disable();
  }

  this.validationLinear()
}


BEEChecked = false;

onBEEChecked() {
  
  if(this.BEEChecked == false) {
    this.BEEChecked = true;
    
    this.FoundationaldocumentsFormGroup.get("BEELevel")?.enable();
    
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").enable();
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").enable();

    if(this.DueDilligenceDetails.b_BBEE_Certificate_Provided != true) {
      this.FoundationaldocumentsFormGroup.get("BEECertificateDoc")?.addValidators(Validators.required);
    }
    

  }
  else if(this.BEEChecked == true) 
  {
    this.BEEChecked = false;
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc")?.removeValidators;
    this.FoundationaldocumentsFormGroup.get("BEELevel")?.disable();
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").disable();
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").disable();
  }
  this.validationLinear()
}






Create() {
  this.route.paramMap.subscribe({
    next: (paramater) => {
      
      let VendorID = paramater.get("VendorID");

      if(this.FoundationaldocumentsFormGroup.get("BBBEECertificate")?.value == true && this.DueDilligenceData.b_BBEE_Certificate_Provided == true) {
       // this.VenBEEDetails.vendor = this.Vendor;
       
        this.VenBEEDetails.beE_ID = 0;
        this.VenBEEDetails.vendor_ID = Number(VendorID);
        this.VenBEEDetails.beE_Level = this.FoundationaldocumentsFormGroup.get("BEELevel")?.value;
        this.VenBEEDetails.vendor = this.DueDilligenceDetails.vendor
        let test: any
        test = new DatePipe('en-ZA');
        if(this.VenBEEDetails.date != test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a')) {
          this.VendorService.GenerateVendorBEEExpiryNotification(this.VenBEEDetails.vendor_ID,test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a')).subscribe();
        }
        this.VenBEEDetails.date = test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a');
        let FolderCategory = "BEE";
        let VendorNo = "Vendor" + Number(VendorID);
        if(this.file[0] != null) {
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[0].FileName).subscribe(r => {
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[0]).subscribe(response => {
              let Path: any = response
              this.VenBEEDetails.beE_Certificate  = Path.returnedPath.toString();
              this.VendorService.UpdateBEEDetails(this.VenBEEDetails.vendor_ID,this.VenBEEDetails).subscribe()
             })
          })
        }
        else {
          this.VendorService.UpdateBEEDetails(this.VenBEEDetails.vendor_ID,this.VenBEEDetails).subscribe()
        }  
      }
      else if (this.DueDilligenceData.b_BBEE_Certificate_Provided == true && this.FoundationaldocumentsFormGroup.get("BBBEECertificate")?.value == false)
      {
         this.VendorService.GetBEEDetails(Number(VendorID)).subscribe(response => 
         {
           
           let sFile = response.beE_Certificate;
           let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
           sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
           let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
           let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
           this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,filename).subscribe()
           this.VendorService.DeleteBEEDetails(response.beE_ID).subscribe()
         })
      }
      else if(this.FoundationaldocumentsFormGroup.get("BBBEECertificate")?.value == true && this.DueDilligenceData.b_BBEE_Certificate_Provided == false) {
        this.VenBEEDetails.beE_ID = 0;
        this.VenBEEDetails.vendor_ID = Number(VendorID);
        this.VenBEEDetails.beE_Level = this.FoundationaldocumentsFormGroup.get("BEELevel")?.value;
        let test: any
        test = new DatePipe('en-ZA');
        this.VenBEEDetails.date = test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a');
        this.VendorService.GenerateVendorBEEExpiryNotification(this.VenBEEDetails.vendor_ID,this.VenBEEDetails.date).subscribe();
        
        let FolderCategory = "BEE";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[0]).subscribe(response => {
         let Path: any = response
         this.VenBEEDetails.beE_Certificate  = Path.returnedPath.toString();
         this.VendorService.AddBEEDetails(this.VenBEEDetails).subscribe()
        })
      }

      //this.DueDilligenceDetails.due_Diligence_ID = 0
      this.DueDilligenceDetails.vendor_ID = Number(VendorID);
      this.DueDilligenceDetails.due_Diligence_Doc = false;
      //foundational documents
      this.DueDilligenceDetails.mutual_Nda_Signed = this.FoundationaldocumentsFormGroup.get("MutualNDA")?.value
      this.DueDilligenceDetails.basic_Company_Info_Provided = this.FoundationaldocumentsFormGroup.get("BasicCompanyInfo")?.value
      this.DueDilligenceDetails.group_Structure_Provided = this.FoundationaldocumentsFormGroup.get("GroupStructure")?.value
      this.DueDilligenceDetails.income_Tax_Number_Provided = this.FoundationaldocumentsFormGroup.get("IncomeTaxNumber")?.value
      this.DueDilligenceDetails.vat_Number_Provided = this.FoundationaldocumentsFormGroup.get("VatNumber")?.value
      this.DueDilligenceDetails.company_Reg_Doc_Provided = this.FoundationaldocumentsFormGroup.get("CIPC")?.value
      this.DueDilligenceDetails.letter_Of_Good_Standing_Provided = this.FoundationaldocumentsFormGroup.get("LetterofGoodStanding")?.value
      this.DueDilligenceDetails.b_BBEE_Certificate_Provided = this.BEEChecked
      this.DueDilligenceDetails.direcor_Details_Provided = this.FoundationaldocumentsFormGroup.get("DirectorsInfo")?.value
      this.DueDilligenceDetails.company_Resolution_Agreement_Provided = this.FoundationaldocumentsFormGroup.get("CompanyResolutionAgreement")?.value

      //financials
      this.DueDilligenceDetails.vat_Reg_Certificate_Provided = this.FinancialsFormGroup.get("VATRegistrationCertificate")?.value
      this.DueDilligenceDetails.tax_Clearance_Certificate_Provided = this.FinancialsFormGroup.get("TaxClearanceCertificate")?.value
      this.DueDilligenceDetails.bank_Stamped_Confirtmation = this.FinancialsFormGroup.get("bank_Stamped_Confirtmation")?.value
      
      //subcontracting
      this.DueDilligenceDetails.subcontractor_Name_Provided = this.SubContractingFormGroup.get("NameSubContractor")?.value
      this.DueDilligenceDetails.company_Details_Provided = this.SubContractingFormGroup.get("CompanyDetails")?.value
      this.DueDilligenceDetails.individual_Details_Provided = this.SubContractingFormGroup.get("IndividualDetails")?.value

      //insurnace
      this.DueDilligenceDetails.general_Liability_Insurance_Present = this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value
      this.DueDilligenceDetails.cyber_Insurance_Present = this.InsuranceFormGroup.get("CyberInsurance")?.value
      this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present = this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value
      this.DueDilligenceDetails.other_Insurance_Required = this.InsuranceFormGroup.get("OtherInsurance")?.value

      if(this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value == true && this.file[1] != null) {

        if(this.DueDilligenceData.general_Liability_Insurance_Present == true) {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[1].FileName).subscribe(response => {
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[1]).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
              this.VendorInsurance.vendor_ID = Number(VendorID);
              this.VendorInsurance.vendor_Insurance_Type_ID = 1;
              this.VendorService.UpdateInsurance(this.VendorInsurance.vendor_ID,this.VendorInsurance).subscribe()
            })
          })
        }
        else {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[1]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 1;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe()
          })
        }

        
      }
      else if(this.DueDilligenceData.general_Liability_Insurance_Present == true && this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value == false) {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[1].FileName).subscribe(response => {
            this.VendorService.DeleteInsuranceByID(Number(VendorID),1).subscribe()
          })
      }

      if(this.InsuranceFormGroup.get("CyberInsurance")?.value == true && this.file[2] != null) {
        if(this.DueDilligenceData.cyber_Insurance_Present == true) {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[2].FileName).subscribe(response => {
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[2]).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
              this.VendorInsurance.vendor_ID = Number(VendorID);
              this.VendorInsurance.vendor_Insurance_Type_ID = 2;
              this.VendorService.UpdateInsurance(this.VendorInsurance.vendor_ID,this.VendorInsurance).subscribe()
            })
          })
        }
        else {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[2]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 2;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe()
          })
        }
      }
      else if(this.DueDilligenceData.cyber_Insurance_Present == true && this.InsuranceFormGroup.get("CyberInsurance")?.value == false) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[2].FileName).subscribe(response => {
          this.VendorService.DeleteInsuranceByID(Number(VendorID),2).subscribe()
        })
      }


      if(this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value == true && this.file[3] != null) {
        if(this.DueDilligenceData.proffesional_Indemnity_Insurance_Present == true) {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[3].FileName).subscribe(response => {
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[3]).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
              this.VendorInsurance.vendor_ID = Number(VendorID);
              this.VendorInsurance.vendor_Insurance_Type_ID = 3;
              this.VendorService.UpdateInsurance(this.VendorInsurance.vendor_ID,this.VendorInsurance).subscribe()
            })
          })
        }
        else {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[3]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 3;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe()
          })
        }
      }
      else if(this.DueDilligenceData.proffesional_Indemnity_Insurance_Present == true && this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value == false) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[3].FileName).subscribe(response => {
          this.VendorService.DeleteInsuranceByID(Number(VendorID),3).subscribe()
        })
      }

      if(this.InsuranceFormGroup.get("OtherInsurance")?.value == true && this.file[4] != null) {
        if(this.DueDilligenceData.other_Insurance_Required == true) {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[4].FileName).subscribe(response => {
            this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[4]).subscribe(response => {
              let Path: any = response
              this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
              this.VendorInsurance.vendor_ID = Number(VendorID);
              this.VendorInsurance.vendor_Insurance_Type_ID = 4;
              this.VendorService.UpdateInsurance(this.VendorInsurance.vendor_ID,this.VendorInsurance).subscribe()
            })
          })
        }
        else {
          let FolderCategory = "Insurance";
          let VendorNo = "Vendor" + Number(VendorID);
          this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[4]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 4;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe()
          })
        }
      }
      else if(this.DueDilligenceData.other_Insurance_Required == true && this.InsuranceFormGroup.get("OtherInsurance")?.value == false) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails[4].FileName).subscribe(response => {
          this.VendorService.DeleteInsuranceByID(Number(VendorID),4).subscribe()
        })
      }

      if(this.DueDilligenceData.cyber_Insurance_Present == true || this.DueDilligenceData.other_Insurance_Required == true || this.DueDilligenceData.general_Liability_Insurance_Present == true || this.DueDilligenceData.proffesional_Indemnity_Insurance_Present == true) {
        this.VendorService.GetAllVendorDetails().subscribe(result => {
          let value:VendorDetails[] = result
          let filterValue = value.find(x=> x.vendor_ID == Number(VendorID))
          filterValue.insurance_Provided = true
          this.VendorService.UpdateVendorDetails(filterValue.vendor_Detail_ID,filterValue).subscribe(result => {
  
          })
        })
      }
      else {
        this.VendorService.GetAllVendorDetails().subscribe(result => {
          let value:VendorDetails[] = result
          let filterValue = value.find(x=> x.vendor_ID == Number(VendorID))
          filterValue.insurance_Provided = false
          this.VendorService.UpdateVendorDetails(filterValue.vendor_Detail_ID,filterValue).subscribe(result => {
  
          })
        })
      }
      

      //licensesorprofessional
      this.DueDilligenceDetails.licenses_Required= this.LicensesOrProfessionalAccreditationFormGroup.get("LicensesRequired")?.value
      this.DueDilligenceDetails.accreditation_Required = this.LicensesOrProfessionalAccreditationFormGroup.get("AccreditationRequired")?.value
      this.DueDilligenceDetails.proffesional_Membership_Required = this.LicensesOrProfessionalAccreditationFormGroup.get("ProfessionalMembershipRequired")?.value

      //information security
      this.DueDilligenceDetails.business_Continuity_Present = this.InformationSecurityFormGroup.get("BusinessContinuityPlan")?.value
      this.DueDilligenceDetails.dIsaster_Recovery_Plan_Present = this.InformationSecurityFormGroup.get("DisasterRecoveryPlan")?.value
      this.DueDilligenceDetails.popI_Present = this.POPIChecked
      this.DueDilligenceDetails.data_Security_Breaches_Present = this.InformationSecurityFormGroup.get("DataSecurityBreachesPresent")?.value
      this.DueDilligenceDetails.site_Visits_Present = this.InformationSecurityFormGroup.get("SiteVisitsPresent")?.value

      //Policy Review
      this.DueDilligenceDetails.information_Security_Policy_Present = this.PolicyReviewFormGroup.get("InformationSecurityPolicyPresent")?.value
      this.DueDilligenceDetails.privacy_Policy_Present_Present = this.PolicyReviewFormGroup.get("PrivacyPolicyPresentPresent")?.value
      this.DueDilligenceDetails.data_Retention_Destruction_Policy_Present = this.PolicyReviewFormGroup.get("DataRetentionDestructionPolicyPresent")?.value
      this.DueDilligenceDetails.anti_Bribery_Corruption_Policy_Present = this.PolicyReviewFormGroup.get("AntiBriberyCorruptionPolicyPresent")?.value
      this.DueDilligenceDetails.ethics_Policy_Present = this.PolicyReviewFormGroup.get("EthicsPolicyPresent")?.value
      this.DueDilligenceDetails.conflict_Of_Interest_Policy_Present = this.PolicyReviewFormGroup.get("ConflictOfInterestPolicyPresent")?.value
      this.DueDilligenceDetails.customer_Complaints_Policy_Present = this.PolicyReviewFormGroup.get("CustomerComplaintsPolicyPresent")?.value

      //business references
      this.DueDilligenceDetails.business_References_Present = this.BusinessReferencesFormGroup.get("BusinessReferencesPresent")?.value

      //this.DueDilligenceDetails.vendor = this.Vendor
      this.VendorService.UpdateDueDiligence(this.DueDilligenceDetails.vendor_ID,this.DueDilligenceDetails).subscribe(response => {
        if(this.POPIChecked == true) {
          if(this.DueDilligenceData.popI_Present == true) {
            this.POPIDetails.contracted_Partner_Type_ID = this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID")?.value
          this.POPIDetails.due_Diligence_ID = response.due_Diligence_ID
          this.POPIDetails.due_Dillegence = response
          this.POPIDetails.due_Dillegence.vendor = response.vendor
          this.POPIDetails.due_Dillegence.vendor.vendor_Status = response.vendor.vendor_Status
          this.POPIDetails.personal_Data_Purpose = this.InformationSecurityFormGroup.get("Personal_Data_Purpose")?.value 
          this.POPIDetails.dataProcessing_JointController_Agreement = this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement")?.value 
          this.POPIDetails.confidentiality_Importance_Highlighted = this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted")?.value 
          this.POPIDetails.contract_Audits_Provisions_Provided = this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided")?.value 
          this.POPIDetails.activity_Liability_Present = this.InformationSecurityFormGroup.get("Activity_Liability_Present")?.value 
          this.POPIDetails.third_Party_Data_Processing_Provisioned = this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned")?.value 
          this.POPIDetails.contract_End_Data_Management_Provided = this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided")?.value 
          this.POPIDetails.personal_Data_Processing_Details_Present = this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present")?.value 
          this.POPIDetails.processing_Activities_Certification_Held = this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held")?.value 
            this.VendorService.UpdatePOPI(response.due_Diligence_ID,this.POPIDetails).subscribe()
          }
          else {
            this.POPIDetails.contracted_Partner_Type_ID = this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID")?.value
          this.POPIDetails.due_Diligence_ID = response.due_Diligence_ID
          this.POPIDetails.due_Dillegence = response
          this.POPIDetails.due_Dillegence.vendor = response.vendor
          this.POPIDetails.due_Dillegence.vendor.vendor_Status = response.vendor.vendor_Status
          this.POPIDetails.personal_Data_Purpose = this.InformationSecurityFormGroup.get("Personal_Data_Purpose")?.value 
          this.POPIDetails.dataProcessing_JointController_Agreement = this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement")?.value 
          this.POPIDetails.confidentiality_Importance_Highlighted = this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted")?.value 
          this.POPIDetails.contract_Audits_Provisions_Provided = this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided")?.value 
          this.POPIDetails.activity_Liability_Present = this.InformationSecurityFormGroup.get("Activity_Liability_Present")?.value 
          this.POPIDetails.third_Party_Data_Processing_Provisioned = this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned")?.value 
          this.POPIDetails.contract_End_Data_Management_Provided = this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided")?.value 
          this.POPIDetails.personal_Data_Processing_Details_Present = this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present")?.value 
          this.POPIDetails.processing_Activities_Certification_Held = this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held")?.value 
            this.VendorService.AddPOPI(this.POPIDetails).subscribe()
          }
          
        }
        else if(this.DueDilligenceData.popI_Present == true){
          this.VendorService.GetPOPI(response.due_Diligence_ID).subscribe(response => {
            this.VendorService.DeletePOPI(response.popI_ID).subscribe(next => {
              
            })
          })
        }  
      })
        
    }
    
  })

  this.log.action = "Updated BEE/Due Diligence Checklist of " + this.DueDilligenceData.vendor.name;
    this.log.user = this.VendorService.decodeUser(sessionStorage.getItem("token"));
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.VendorService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        var action = "UPDATE";
        var title = "UPDATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully <strong style='color:green'> UPDATED </strong> Due Dilligence Checklist for <strong>" + this.DueDilligenceData.vendor.name + "</strong>.");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 2000;
        setTimeout(() => {
          this.router.navigate(['/vendor-unofficial-vendorlist'])
          dialogRef.close();
        }, duration);
      }
    })
  
  
 


}

file:File[] = [null,null,null,null,null]

FileAdd(i:number,event:any) {
  this.file[i] = event.target.files[0] ;
}

bvalid = false

validationLinear() {
  if(this.DueDiligenceChecklistDetailsFormGroup.valid == true && this.FoundationaldocumentsFormGroup.valid == true && this.InsuranceFormGroup.valid == true && this.InformationSecurityFormGroup.valid == true) {
    this.bvalid = false;
  }
  else {
    this.bvalid = true;
  }
}







openEditDueDillTab(): void {
  const userManualUrl = 'assets/PDF/DueDiligenceChecklistUM.pdf'; 
  window.open(userManualUrl, '_blank');
}
}



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
