import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-vendor-approved-add-details',
  templateUrl: './vendor-approved-add-details.component.html',
  styleUrls: ['./vendor-approved-add-details.component.css']
})
export class VendorApprovedAddDetailsComponent implements OnInit{

  matcher = new MyErrorStateMatcher()

  constructor(private _formBuilder: FormBuilder,private VendorService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

  FoundationaldocumentsFormGroup = this._formBuilder.group({
    MutualNDA: false,
    BasicCompanyInfo: false,
    GroupStructure: false,
    IncomeTaxNumber: false,
    VatNumber:false,
    CIPC: false,
    LetterOfGoodStanding: false,
    BBBEECertificate: false,
    DirectorsInfo: false,
    CompanyResolutionAgreement: false,
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


  ngOnInit(): void {
  
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
        let VendorID = paramater.get("VendorID");
        this.VendorService.GetVendorByID(Number(VendorID)).subscribe(result => {
        
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


}





export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}