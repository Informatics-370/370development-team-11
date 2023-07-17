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

@Component({
  selector: 'app-vendor-approve-edit',
  templateUrl: './vendor-approve-edit.component.html',
  styleUrls: ['./vendor-approve-edit.component.css']
})
export class VendorApproveEditComponent implements OnInit{

  matcher = new MyErrorStateMatcher()
  

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
  };

  ContractedPartnerTypeDetails: Contracted_Partner_Type = {
    contracted_Partner_Type_ID:1,
    name:'',
    description:'',
  };

  POPIDetails: POPI = {
    pOPI_ID:0,
    contracted_Partner_Type_ID:0,
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





  FoundationaldocumentsFormGroup = this._formBuilder.group({
    MutualNDA: false,
    BasicCompanyInfo: false,
    GroupStructure: false,
    IncomeTaxNumber: false,
    VatNumber:false,
    CIPC: false,
    LetterofGoodStanding: false,
    BBBEECertificate: false,
    DirectorsInfo: false,
    CompanyResolutionAgreement: false,
    BEELevel: 0,
    BEECertificateDoc:'',
    BEEValidatityDate:Date.now(),
  });


  FinancialsFormGroup = this._formBuilder.group({
    VATRegistrationCertificate: false,
    TaxClearanceCertificate: false,
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
    Personal_Data_Purpose: false,
    Contracted_Partner_Type_ID:0,
    DataProcessing_JointController_Agreement: false,
    Confidentiality_Importance_Highlighted:false,
    Contract_Audits_Provisions_Provided:false,
    Activity_Liability_Present:false,
    Third_Party_Data_Processing_Provisioned:false,
    Contract_End_Data_Management_Provided:false,
    Personal_Data_Processing_Details_Present:false,
    Processing_Activities_Certification_Held:false,
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



  FileDetails:any = [];
  DueDilligenceData:any;
  ngOnInit() {
   // console.log(this.Vendor)
   // console.log(this.file)
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorID = paramater.get("VendorID");
        console.log(VendorID)
        this.VendorService.GetDueDiligence(Number(VendorID)).subscribe(element => {
    
          console.log(element)
          this.DueDilligenceData = element
          console.log(this.DueDilligenceData)
          this.FoundationaldocumentsFormGroup.get("MutualNDA")?.setValue(element.mutual_Nda_Signed)
          this.FoundationaldocumentsFormGroup.get("BasicCompanyInfo")?.setValue(element.basic_Company_Info_Provided)
          this.FoundationaldocumentsFormGroup.get("GroupStructure")?.setValue(element.group_Structure_Provided)
          this.FoundationaldocumentsFormGroup.get("IncomeTaxNumber")?.setValue(element.income_Tax_Number_Provided)
          this.FoundationaldocumentsFormGroup.get("VatNumber")?.setValue(element.vat_Number_Provided)
          this.FoundationaldocumentsFormGroup.get("CIPC")?.setValue(element.company_Reg_Doc_Provided)
          this.FoundationaldocumentsFormGroup.get("LetterofGoodStanding")?.setValue(element.letter_Of_Good_Standing_Provided)
          //this.FoundationaldocumentsFormGroup.get("BBBEECertificate")?.setValue(element.b_BBEE_Certificate_Provided)
          //this.DueDilligenceDetails.b_BBEE_Certificate_Provided = element.b_BBEE_Certificate_Provided
          this.BEEChecked = element.b_BBEE_Certificate_Provided
          this.FoundationaldocumentsFormGroup.get("DirectorsInfo")?.setValue(element.direcor_Details_Provided )
          this.FoundationaldocumentsFormGroup.get("CompanyResolutionAgreement")?.setValue(element.company_Resolution_Agreement_Provided)
          //financials
      this.FinancialsFormGroup.get("VATRegistrationCertificate")?.setValue(element.vat_Reg_Certificate_Provided)
      this.FinancialsFormGroup.get("TaxClearanceCertificate")?.setValue(element.tax_Clearance_Certificate_Provided)

      //subcontracting
      this.SubContractingFormGroup.get("NameSubContractor")?.setValue(element.subcontractor_Name_Provided)
      this.SubContractingFormGroup.get("CompanyDetails")?.setValue(element.company_Details_Provided)
      this.SubContractingFormGroup.get("IndividualDetails")?.setValue(element.individual_Details_Provided)

      //insurnace
      this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.setValue(element.general_Liability_Insurance_Present)
      this.InsuranceFormGroup.get("CyberInsurance")?.setValue(element.cyber_Insurance_Present)
      this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.setValue(element.proffesional_Indemnity_Insurance_Present)
      this.InsuranceFormGroup.get("OtherInsurance")?.setValue(element.other_Insurance_Required)

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

          if(element.popI_Present = true) {
            this.VendorService.GetPOPI(element.due_Diligence_ID).subscribe(response => {
              this.POPIDetails = response
              console.log(response)
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
          if(element.b_BBEE_Certificate_Provided == true) {
            this.VendorService.GetBEEDetails(Number(VendorID)).subscribe(response => {
              this.VenBEEDetails = response //Number(VendorID)
              if(this.BEEChecked == true) {
                this.FoundationaldocumentsFormGroup.get("BEELevel")?.setValue(response.beE_Level);
                this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.setValue(response.date);
                console.log(response)
                let sFile = response.beE_Certificate;
                let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
                sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
                let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
                let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
                this.FileDetails.push({FileURL:`https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`,FileName:filename})
                console.log(this.FileDetails)
              }
            })
          }

        var action = "UPDATE";
        var title = "UPDATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully updated Due Dilligence Checklist for <strong>" + this.DueDilligenceData.vendor.name  +  "</strong>.");
    
        const dialogRef:MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });
    
        const duration = 2000;
        setTimeout(() => {
          //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
          dialogRef.close();
        }, duration);

        })
      }
    }
    )}//ngomt



  setFocus(stepper: MatStepper) {
    if(stepper != null) {
      setTimeout(() => {
    
        document.getElementById(stepper.selectedIndex.toString()).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
        //this.setFocus(stepper)
        }, 100);
    }
      
    
    
    
    //this.setFocus(stepper)
  }
  

POPIChecked = false;

onPOPIChecked(stepper: MatStepper) {
  
  if(this.POPIChecked == false) {
    this.POPIChecked = true;
    this.setFocus(stepper)
  }
  else if(this.POPIChecked == true) 
  {
    this.POPIChecked = false;
  }


}


BEEChecked = false;

onBEEChecked() {
  console.log("you")
  if(this.BEEChecked == false) {
    this.BEEChecked = true;
    //this.setFocus(stepper)
  }
  else if(this.BEEChecked == true) 
  {
    this.BEEChecked = false;
  }


}






Create() {
 
  this.route.paramMap.subscribe({
    next: (paramater) => {
      
      let VendorID = paramater.get("VendorID");
      
      if(this.BEEChecked == true) {
       // this.VenBEEDetails.vendor = this.Vendor;
       if(this.DueDilligenceData.b_BBEE_Certificate_Provided == true) {
        this.VenBEEDetails.beE_ID = 0;
        this.VenBEEDetails.vendor_ID = Number(VendorID);
        this.VenBEEDetails.beE_Level = this.FoundationaldocumentsFormGroup.get("BEELevel")?.value;
        this.VenBEEDetails.vendor = this.DueDilligenceDetails.vendor
        let test: any
        test = new DatePipe('en-ZA');
        this.VenBEEDetails.date = test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a');
        let FolderCategory = "BEE";
        let VendorNo = "Vendor" + Number(VendorID);
        if(this.file != undefined) {
          this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,this.FileDetails.FileName)
          this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file).subscribe(response => {
            let Path: any = response
            this.VenBEEDetails.beE_Certificate  = Path.returnedPath.toString();
            this.VendorService.UpdateBEEDetails(this.VenBEEDetails.vendor_ID,this.VenBEEDetails).subscribe(response => {console.log(response)})
           })
        }
        else {
          this.VendorService.UpdateBEEDetails(this.VenBEEDetails.vendor_ID,this.VenBEEDetails).subscribe(response => {console.log(response)})
        }
       }
       else {
          this.VendorService.GetBEEDetails(Number(VendorID)).subscribe(response => 
          {
            
            let sFile = response.beE_Certificate;
            let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            this.VendorService.DeleteVendorFile(FolderCategory,VendorNo,filename).subscribe()
            this.VendorService.DeleteBEEDetails(response.beE_ID).subscribe(result => {
              this.VenBEEDetails.beE_ID = 0;
              this.VenBEEDetails.vendor_ID = Number(VendorID);
              this.VenBEEDetails.beE_Level = this.FoundationaldocumentsFormGroup.get("BEELevel")?.value;
              let test: any
              test = new DatePipe('en-ZA');
              this.VenBEEDetails.date = test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a');
              FolderCategory = "BEE";
              VendorNo = "Vendor" + Number(VendorID);
        
              this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file).subscribe(response => {
              let Path: any = response
              this.VenBEEDetails.beE_Certificate  = Path.returnedPath.toString();
              this.VendorService.AddBEEDetails(this.VenBEEDetails).subscribe(response => {console.log(response)})
              })
            })
          })
       }
        
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

      //subcontracting
      this.DueDilligenceDetails.subcontractor_Name_Provided = this.SubContractingFormGroup.get("NameSubContractor")?.value
      this.DueDilligenceDetails.company_Details_Provided = this.SubContractingFormGroup.get("CompanyDetails")?.value
      this.DueDilligenceDetails.individual_Details_Provided = this.SubContractingFormGroup.get("IndividualDetails")?.value

      //insurnace
      this.DueDilligenceDetails.general_Liability_Insurance_Present = this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value
      this.DueDilligenceDetails.cyber_Insurance_Present = this.InsuranceFormGroup.get("CyberInsurance")?.value
      this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present = this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value
      this.DueDilligenceDetails.other_Insurance_Required = this.InsuranceFormGroup.get("OtherInsurance")?.value

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
      console.log(this.DueDilligenceDetails)
      this.VendorService.UpdateDueDiligence(this.DueDilligenceDetails.vendor_ID,this.DueDilligenceDetails).subscribe(response => {
        console.log(response)
        if(this.POPIChecked == true) {
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
          console.log(this.POPIDetails)
          if(this.DueDilligenceData.popI_Present == true) {
            this.VendorService.UpdatePOPI(response.due_Diligence_ID,this.POPIDetails).subscribe(response => {console.log(response)})
          }
          else {
            this.VendorService.GetPOPI(response.due_Diligence_ID).subscribe(response => {
              console.log(response)
              this.VendorService.DeletePOPI(response.popI_ID).subscribe(next => {
                this.VendorService.AddPOPI(this.POPIDetails).subscribe(response => {console.log(response)})
              })
            })
          }
          
        }  
      })
        
    }
    
  })
  
  this.router.navigate(['/vendor-unofficial-vendorlist'])


}

file:File

CreateTest(event:any) {
  this.file = event.target.files[0] ;
}






}



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}