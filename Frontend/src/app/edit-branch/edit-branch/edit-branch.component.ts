import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Branch } from 'src/app/Shared/Branch';
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditBranchComponent implements OnInit{
  public myForm !: FormGroup;

  Branch: any

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      street: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      city: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]),
      postal_Code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]+$")]),
      province: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });

    this.dataService.GetBranch(+this.route.snapshot.params['branch_ID']).subscribe(result => {
      this.Branch = result
      console.log(result)
      this.myForm.patchValue({
        name: this.Branch.name,
        street: this.Branch.street,
        city: this.Branch.city,
        postal_Code: this.Branch.postal_Code,
        province: this.Branch.province
      });
    })
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewBranch');
  }

  onSubmit() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    var name = this.myForm.get('name')?.value;

    this.dataService.EditBranchValidation(name, this.Branch.branch_ID).subscribe({
      next: (Result) => {
        console.log(Result)
        if (Result == null) {
          this.dataService.EditBranch(this.Branch.branch_ID, this.myForm.value).subscribe({
            next: (response) => {
              document.getElementById('AnimationBtn').classList.toggle("is_active");
              document.getElementById('cBtn').style.display = "none";

              this.log.action = "Edited Branch: " + this.Branch.name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
          })
        }
        else if (Result.name == name && Result.branch_ID == this.Branch.branch_ID) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to Branch: <strong>" + name + "</strong>");

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
        else {
          var action = "ERROR";
          var title = "ERROR: Branch Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  // onSubmit() {
  //   var street = this.myForm.get('street')?.value;

  //   this.dataService.BranchValidation(street).subscribe({
  //     next: (Result) => {
  //       if (Result == null) {
  //         this.dataService.EditBranch(this.Branch.branch_ID, this.myForm.value).subscribe({
  //           next: (response) => {
  //             var action = "Update";
  //             var title = "UPDATE SUCCESSFUL";
  //             var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + street + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

  //             const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //               disableClose: true,
  //               data: { action, title, message }
  //             });

  //             const duration = 1750;
  //             setTimeout(() => {
  //               this.router.navigate(['/ViewBranch']);
  //               dialogRef.close();
  //             }, duration);
  //           }
  //         })
  //       }

  //       if (Result.branch_ID !== this.Branch.branch_ID && Result.street === this.Branch.street) {
  //         var action = "ERROR";
  //         var title = "ERROR: Branch Exists";
  //         var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch with this street address <strong>" + this.Branch.street + " <strong style='color:red'>ALREADY EXISTS!</strong>");

  //         const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //           disableClose: true,
  //           data: { action, title, message }
  //         });

  //         const duration = 1750;
  //         setTimeout(() => {
  //           dialogRef.close();
  //         }, duration);
  //       }

  //       else if (Result.name === this.Branch.name &&
  //         Result.street === this.Branch.street  &&
  //         Result.city === this.Branch.city &&
  //         Result.postal_Code === this.Branch.postal_Code &&
  //         Result.province === this.Branch.province) {
  //         var action = "NOTIFICATION";
  //         var title = "NOTIFICATION: NO CHANGES MADE";
  //         var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to the Branch: <strong>" + this.Branch.street + "</strong>");

  //         const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //           disableClose: true,
  //           data: { action, title, message }
  //         });

  //         const duration = 1750;
  //         setTimeout(() => {
  //           this.router.navigate(['/ViewBranch']);
  //           dialogRef.close();
  //         }, duration);
  //       }
  //       else if (Result.name !== this.Branch.name ||
  //         Result.street !== this.Branch.street ||
  //         Result.city !== this.Branch.city ||
  //         Result.postal_Code !== this.Branch.postal_Code ||
  //         Result.province !== this.Branch.province
  //         && Result.branch_ID == this.Branch.branch_ID) {
  //         this.dataService.EditBranch(this.Branch.branch_ID, this.Branch).subscribe({
  //           next: (response) => {
  //             var action = "Update";
  //             var title = "UPDATE SUCCESSFUL";
  //             var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Branch <strong>" + this.Branch.street + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

  //             const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //               disableClose: true,
  //               data: { action, title, message }
  //             });

  //             const duration = 1750;
  //             setTimeout(() => {
  //               this.router.navigate(['/ViewBranch']);
  //               dialogRef.close();
  //             }, duration);

  //           }
  //         });

  //       }


  //     }
  //   })





  // }



  openEditBranchTab(): void {
    const userManualUrl = 'assets/PDF/EditBranchUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }

}
