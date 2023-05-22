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
  constructor(private router: Router, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }



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

    var street = this.myForm.get('street')?.value;

    this.dataService.BranchValidation(street).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddBranch(this.myForm.value).subscribe({
            next: (response) => {
              var action = "Create";
              var title = "CREATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + street + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/ViewBranch']);
                dialogRef.close();
              }, duration);
            }
          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Branch Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch street address <strong>" + street + " <strong style='color:red'>ALREADY EXISTS!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
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
