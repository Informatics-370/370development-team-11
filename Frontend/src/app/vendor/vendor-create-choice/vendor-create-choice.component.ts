import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';

@Component({
  selector: 'app-vendor-create-choice',
  templateUrl: './vendor-create-choice.component.html',
  styleUrls: ['./vendor-create-choice.component.css']
})

export class VendorCreateChoiceComponent {

  showConfirmationDialog: boolean = true;
  matcher = new MyErrorStateMatcher()

  constructor(public dialogRef: MatDialogRef<VendorCreateChoiceComponent>,private formBuilder: FormBuilder, private router: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }
//create api backend 1 for get and one for delete 
    VendorDetails: any[] = [];
    mySelect: FormGroup = this.formBuilder.group({VendorsApproved: ['', [Validators.required]]});
    ngOnInit(): void {
      this.mySelect = this.formBuilder.group({VendorsApproved: ['', [Validators.required]]})


      this.dataService.getAllApprovedVendors().subscribe(result => {
      let requestlist:any[] = result
      requestlist.forEach((element) => {
      this.VendorDetails.push(element)
      });//result      
    })//dataservice
        
      
    
  
 
}//ngonIt

  onConfirm(): void {
   let VendorID = this.mySelect.get('VendorsApproved')?.value;
   this.dialogRef.close();
   this.router.navigate([`/vendor-create/${VendorID}`]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }







}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}