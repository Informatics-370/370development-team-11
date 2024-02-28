import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';


import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-vendor-create-choice',
  templateUrl: './vendor-create-choice.component.html',
  styleUrls: ['./vendor-create-choice.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})

export class VendorCreateChoiceComponent {

  showConfirmationDialog: boolean = true;
  matcher = new MyErrorStateMatcher()

  User:string;
  TempUser:string;

  constructor(public dialogRef: MatDialogRef<VendorCreateChoiceComponent>,private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }
//create api backend 1 for get and one for delete 
    VendorDetails: any[] = [];
    mySelect: FormGroup = this.formBuilder.group({VendorsApproved: ['', [Validators.required]]});
    ngOnInit(): void {
      this.mySelect = this.formBuilder.group({ VendorsApproved: ['', [Validators.required]] })
      this.User = this.dataService.decodeUser(sessionStorage.getItem('token'))
      this.TempUser = this.dataService.decodeTempUsername(sessionStorage.getItem('token'))

      this.dataService.GetEmployeeByUsername(this.TempUser).subscribe({next: (tempResult) => {
        let TempEmployeeDetails:any = tempResult
        this.getData(TempEmployeeDetails)
      },
      error:(y) => {
        this.getData()
      }
      })


        
      
    
  
 
}//ngonIt


    getData(TempEmpDetails?:any) {
    this.dataService.GetEmployeeByUsername(this.User).subscribe(r => {
      let EmployeeDetails: any = r
      let tempName = "none"
      if(TempEmpDetails != undefined) {
         tempName = TempEmpDetails.employeeName + " " + TempEmpDetails.employeeSurname
      }

      this.dataService.GetAllOnboardRequest().subscribe(e => {
        let onboardRequestDetails: any[] = e
        this.dataService.getAllApprovedVendors(4).subscribe(result => {
          let requestlist: any[] = result
          requestlist.forEach((element) => {
            onboardRequestDetails.forEach(x => {
              let name = EmployeeDetails.employeeName + " " + EmployeeDetails.employeeSurname
              if ((x.onboard_Request_status_ID == 3) && (x.vendor_ID == element.vendor_ID) && (x.employeeName == name || x.employeeName == tempName)) {
                this.VendorDetails.push(element)
              }
            })

          });//result      
        })//3dataservice
      })//2dataservice

    })//1dataservice  
  }

  onConfirm(): void {
   let VendorID = this.mySelect.get('VendorsApproved')?.value;
   this.dialogRef.close();
   this.router.navigate([`/vendor-create/${VendorID}`]);
  // this.dataService.ChangeVendorStatus(2,VendorID).subscribe(result => {
    
   //})
   
  }

  onCancel(): void {
    this.dialogRef.close();
  }






  openAvailableVendorTab(): void {
    const userManualUrl = 'assets/PDF/CreateAvailableVendorUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}