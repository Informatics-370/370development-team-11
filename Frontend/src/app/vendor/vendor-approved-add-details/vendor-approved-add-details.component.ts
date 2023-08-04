import { Component,OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Vendor_BEE } from 'src/app/Shared/VendorBEE';
import { DatePipe } from '@angular/common';
import { Due_Dillegence } from 'src/app/Shared/DueDillegence';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { POPI } from 'src/app/Shared/POPI';
import { Contracted_Partner_Type } from 'src/app/Shared/ContractedPartnerType';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { invalid } from 'moment';
import { Vendor_Insurance_Type } from 'src/app/Shared/VendorInsuranceType';
import { Vendor_Insurance } from 'src/app/Shared/VendorDetailsInsurance';
import { Notification } from 'src/app/Shared/Notification';
import { Role } from 'src/app/Shared/EmployeeRole';
import { User } from 'src/app/Shared/User';
import { Notification_Type } from 'src/app/Shared/Notification_Type';


@Component({
  selector: 'app-vendor-approved-add-details',
  templateUrl: './vendor-approved-add-details.component.html',
  styleUrls: ['./vendor-approved-add-details.component.css']
})
export class VendorApprovedAddDetailsComponent implements OnInit{

  


  matcher = new MyErrorStateMatcher()
  minDate: Date;

  constructor(private _formBuilder: FormBuilder,private VendorService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

  DueDiligenceChecklistDetailsFormGroup = this._formBuilder.group({
    HasDDC:false,
  });


  FoundationaldocumentsFormGroup = this._formBuilder.group({
    MutualNDA: false,
    BasicCompanyInfo: [false,[Validators.requiredTrue]],
    GroupStructure: false,
    IncomeTaxNumber: [false,[Validators.requiredTrue]],
    VatNumber:false,
    CIPC: false,
    LetterofGoodStanding: false,
    BBBEECertificate: false,
    DirectorsInfo: false,
    CompanyResolutionAgreement: false,
    BEELevel: 0,
    BEECertificateDoc:['',[Validators.required]],
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
    Contracted_Partner_Type_ID:0,
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

  onboardRequest: OnboardRequest[] = [];
  RequestID = 0;

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
    no_Notifications: 0,
    role: this.rl
  }


  Notification_Type:Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }

  VendorNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };


  ngOnInit(): void {
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").disable();
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").disable();
    this.InformationSecurityFormGroup.get("Personal_Data_Purpose").disable();
    this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").disable();
    this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement").disable();
    this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted").disable();
    this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided").disable();
    this.InformationSecurityFormGroup.get("Activity_Liability_Present").disable();
    this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned").disable();
    this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided").disable();
    this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present").disable();
    this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held").disable();

   const currentYear = new Date().getFullYear()
   const currentmonth = new Date().getMonth();
   const currentDay = new Date().getDate();
   this.minDate = new Date(currentYear - 1, currentmonth, currentDay+1);
    console.log(this.minDate)
    this.FoundationaldocumentsFormGroup.get("BEELevel").setValue(1);
   
    this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID")?.setValue(1)
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        this.RequestID = Number(paramater.get("RequestNo"));
        this.VendorService.GetRequestByID(this.RequestID).subscribe(result => {
          this.onboardRequest = result
          console.log(this.onboardRequest)
        })
      }
    }
    )}//ngomt



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
    this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID").disable();
    this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement").disable();
    this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted").disable();
    this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided").disable();
    this.InformationSecurityFormGroup.get("Activity_Liability_Present").disable();
    this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned").disable();
    this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided").disable();
    this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present").disable();
    this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held").disable();
  }


}


BEEChecked = false;

onBEEChecked() {
  
  if(this.BEEChecked == false) {
    this.BEEChecked = true;
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").enable();
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").enable();
  }
  else if(this.BEEChecked == true) 
  {
    this.BEEChecked = false;
    this.FoundationaldocumentsFormGroup.get("BEECertificateDoc").disable();
    this.FoundationaldocumentsFormGroup.get("BEEValidatityDate").disable();
  }


}






Create() {
  this.route.paramMap.subscribe({
    next: (paramater) => {
      
      let VendorID = paramater.get("VendorID");
      
      if(this.BEEChecked == true) {
       // this.VenBEEDetails.vendor = this.Vendor;
        this.VenBEEDetails.beE_ID = 0;
        this.VenBEEDetails.vendor_ID = Number(VendorID);
        this.VenBEEDetails.beE_Level = this.FoundationaldocumentsFormGroup.get("BEELevel")?.value;
        let test: any
        test = new DatePipe('en-ZA');
        this.VenBEEDetails.date = test.transform(this.FoundationaldocumentsFormGroup.get("BEEValidatityDate")?.value, 'MMM d, y, h:mm:ss a');
        let FolderCategory = "BEE";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[0]).subscribe(response => {
         let Path: any = response
         this.VenBEEDetails.beE_Certificate  = Path.returnedPath.toString();
         this.VendorService.AddBEEDetails(this.VenBEEDetails).subscribe(response => {
          this.VendorService.GenerateVendorBEEExpiryNotification(this.VenBEEDetails.vendor_ID,this.VenBEEDetails.date).subscribe();
         })
        })
      }

      this.DueDilligenceDetails.due_Diligence_ID = 0
      this.DueDilligenceDetails.vendor_ID = Number(VendorID);
      this.DueDilligenceDetails.due_Diligence_Doc = this.DueDiligenceChecklistDetailsFormGroup.get("HasDDC")?.value
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

      if(this.InsuranceFormGroup.get("GeneralLiabilityInsurance")?.value == true) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[1]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 1;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe(response => {console.log(response)})
        })
      }
      if(this.InsuranceFormGroup.get("CyberInsurance")?.value == true) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[2]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 2;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe(response => {console.log(response)})
        })
      }
      if(this.InsuranceFormGroup.get("ProfessionalIndemnityInsurance")?.value == true) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[3]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 3;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe(response => {console.log(response)})
        })
      }
      if(this.InsuranceFormGroup.get("OtherInsurance")?.value == true) {
        let FolderCategory = "Insurance";
        let VendorNo = "Vendor" + Number(VendorID);
        
        this.VendorService.VendorFileAdd(FolderCategory,VendorNo,this.file[4]).subscribe(response => {
         let Path: any = response
         this.VendorInsurance.confirmation_Doc  = Path.returnedPath.toString();
         this.VendorInsurance.vendor_ID = Number(VendorID);
         this.VendorInsurance.vendor_Insurance_Type_ID = 4;
         this.VendorService.AddInsurance(this.VendorInsurance).subscribe(response => {console.log(response)})
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
      console.log(this.DueDilligenceDetails)
      this.VendorService.AddDueDiligence(this.DueDilligenceDetails).subscribe(response => {

        let result:Due_Dillegence = response[0]
        console.log(response)
        next:{
          if(this.POPIChecked == true) {
            this.POPIDetails.contracted_Partner_Type_ID = this.InformationSecurityFormGroup.get("Contracted_Partner_Type_ID")?.value
            this.POPIDetails.due_Diligence_ID = result.due_Diligence_ID
            this.POPIDetails.due_Dillegence = result
            this.POPIDetails.due_Dillegence.vendor = result.vendor
            this.POPIDetails.due_Dillegence.vendor.vendor_Status = result.vendor.vendor_Status
            this.POPIDetails.personal_Data_Purpose = this.InformationSecurityFormGroup.get("Personal_Data_Purpose")?.value 
            this.POPIDetails.dataProcessing_JointController_Agreement = this.InformationSecurityFormGroup.get("DataProcessing_JointController_Agreement")?.value 
            this.POPIDetails.confidentiality_Importance_Highlighted = this.InformationSecurityFormGroup.get("Confidentiality_Importance_Highlighted")?.value 
            this.POPIDetails.contract_Audits_Provisions_Provided = this.InformationSecurityFormGroup.get("Contract_Audits_Provisions_Provided")?.value 
            this.POPIDetails.activity_Liability_Present = this.InformationSecurityFormGroup.get("Activity_Liability_Present")?.value 
            this.POPIDetails.third_Party_Data_Processing_Provisioned = this.InformationSecurityFormGroup.get("Third_Party_Data_Processing_Provisioned")?.value 
            this.POPIDetails.contract_End_Data_Management_Provided = this.InformationSecurityFormGroup.get("Contract_End_Data_Management_Provided")?.value 
            this.POPIDetails.personal_Data_Processing_Details_Present = this.InformationSecurityFormGroup.get("Personal_Data_Processing_Details_Present")?.value 
            this.POPIDetails.processing_Activities_Certification_Held = this.InformationSecurityFormGroup.get("Processing_Activities_Certification_Held")?.value 
  
            this.VendorService.AddPOPI(this.POPIDetails).subscribe(response => {console.log(response)})
          }  
        }
        for(let a = 0; a < this.onboardRequest.length; a ++) {
          if(this.onboardRequest[a].vendor_ID == Number(VendorID)) {
            this.VendorNotification.notification_Type_ID = 5;
            let transVar: any
            transVar = new DatePipe('en-ZA');
            this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
            this.VendorNotification.name = this.onboardRequest[a].vendor.name + " has been approved";
            this.VendorNotification.user_ID = this.onboardRequest[a].user_Id;
            this.VendorService.VendorAddNotification(this.VendorNotification).subscribe();
          }
        }
        

        var action = "CREATE";
        var title = "CREATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully <strong style='color:green'> ADDED </strong>  Due Dilligence Checklist for <strong>" + result.vendor.name  +  "</strong>.");
    
        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });
    
        const duration = 2000;
        setTimeout(() => {
          //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
         
          dialogRef.close();
        }, duration);

        
      })
      console.log(this.DueDilligenceDetails)
      this.UpdateOnboardRequestStatus(Number(VendorID))
      
    }
  })
  
  



}


ChangesVendorRequestStatus(i:number) {

  for (let a = 0;a < this.onboardRequest.length;a++) {
    if(this.onboardRequest[a].vendor_ID == i) {
      this.VendorService.ChangeVendorStatus(4,i).subscribe()
    }
    else {
      this.VendorService.ChangeVendorStatus(5,this.onboardRequest[a].vendor_ID).subscribe()
    }
      
  }
   
  //this.router.navigate(['/vendor-approved-add-details/' + i])
}


UpdateOnboardRequestStatus(i:number) {

  for (let a = 0;a < this.onboardRequest.length;a++) {
    if(this.onboardRequest[a].vendor_ID == i) {
      this.VendorService.ChangeOnboardStatus(3,this.onboardRequest[a].onboard_Request_Id,this.onboardRequest[a].vendor_ID).subscribe()
    }
    else {
      this.VendorService.ChangeOnboardStatus(2,this.onboardRequest[a].onboard_Request_Id,this.onboardRequest[a].vendor_ID).subscribe()
    }
      
  }
    this.ChangesVendorRequestStatus(i)
    this.router.navigate(['/vendor-unofficial-vendorlist'])
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  
}

file:File[] = [null,null,null,null,null]

FileAdd(i:number,event:any) {
  this.file[i] = event.target.files[0] ;
}

CancelAddDetails() {
 if(this.onboardRequest.length > 2) {
  this.CancelOnboardRequestStatus(this.RequestID)
 }
 else {
  this.router.navigate(['/vendor-unofficial-vendorlist'])
 }
  
}


CancelVendorRequestStatus(i:number) {
  
  for(let a = 0; a < this.onboardRequest.length;a++) {
    //console.log(this.onboardRequest[a].vendor_ID)
    if(this.onboardRequest[a].vendor_ID == i) {
     // console.log(this.onboardRequest[a].vendor_ID)
      this.VendorService.ChangeVendorStatus(1,this.onboardRequest[a].vendor_ID).subscribe()
    }
    else {
      this.VendorService.ChangeVendorStatus(1,this.onboardRequest[a].vendor_ID).subscribe()
    }
    
  }
 // this.router.navigate(['/vendor-approved-add-details/' + i])
}

CancelOnboardRequestStatus(i:number) {
  
  if(this.onboardRequest[0].status_ID == 2) {
    this.ChangesVendorRequestStatus(i)
    for (let a = 0;a < this.onboardRequest.length;a++) {
      
        
        this.VendorService.ChangeOnboardStatus(1,this.onboardRequest[a].onboard_Request_Id,this.onboardRequest[a].vendor_ID).subscribe(next => {})
          console.log(this.onboardRequest[a])
      }
     
    }
    this.router.navigate(['/vendor-approve/' + this.RequestID])
    this.ngOnInit();
   // this.router.navigate(['/vendor-unofficial-vendorlist'])
    //window.location.reload()
    //this.router.navigate(['/vendor-approve/' + this.onboardRequest[0].onboard_Request_Id]) routerLink="/vendor-unofficial-vendorlist"
  }
 
  
}








export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}