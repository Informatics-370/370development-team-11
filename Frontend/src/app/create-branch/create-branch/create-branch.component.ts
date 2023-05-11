import { Component , OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from 'src/app/DataService/data-service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { Branch } from 'src/app/Shared/Branch';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css']
})
export class CreateBranchComponent {
  myForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }



  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      street: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      city: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      postal_Code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]+$")]),
      province: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });
  }
  

  onSubmit() {
    console.log(this.myForm.value);
    this.dataService.AddBranch(this.myForm.value).subscribe(result => {
      this.router.navigate(['ViewBranch'])    
    })
  }
 
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
  
  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewBranch');
  }
}
