import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/Shared/Department';
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
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditDepartmentComponent implements OnInit{
  public myForm !: FormGroup;

  Department:any

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
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });

    this.dataService.GetDepartment(+this.route.snapshot.params['department_ID']).subscribe(result => {
      this.Department = result
      console.log(result)
      this.myForm.patchValue({
        name: this.Department.name,
        description: this.Department.description
      });
    })
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewDepartment');
  }

  // onSubmit() {
  //   var name = this.myForm.get('name')?.value;

  //   this.dataService.DepartmentValidation(name).subscribe({
  //     next: (Result) => {
  //       if (Result == null) {
  //         this.dataService.EditDepartment(this.Department.department_ID, this.myForm.value).subscribe({
  //           next: (response) => {
  //             var action = "Update";
  //             var title = "UPDATE SUCCESSFUL";
  //             var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

  //             const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //               disableClose: true,
  //               data: { action, title, message }
  //             });

  //             const duration = 1750;
  //             setTimeout(() => {
  //               this.router.navigate(['/ViewDepartment']);
  //               dialogRef.close();
  //             }, duration);
  //           }
  //         })
  //       }

  //       if (Result.department_ID !== this.Department.department_ID && Result.name === this.Department.name) {
  //         var action = "ERROR";
  //         var title = "ERROR: Department Exists";
  //         var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + this.Department.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

  //         const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //           disableClose: true,
  //           data: { action, title, message }
  //         });

  //         const duration = 1750;
  //         setTimeout(() => {
  //           dialogRef.close();
  //         }, duration);
  //       }

  //       else if (Result.name === this.Department.name &&
  //         Result.description === this.Department.description) {
  //         var action = "NOTIFICATION";
  //         var title = "NOTIFICATION: NO CHANGES MADE";
  //         var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to the Department: <strong>" + this.Department.name + "</strong>");

  //         const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //           disableClose: true,
  //           data: { action, title, message }
  //         });

  //         const duration = 1750;
  //         setTimeout(() => {
  //           this.router.navigate(['/ViewDepartment']);
  //           dialogRef.close();
  //         }, duration);
  //       }
  //       else if (Result.name !== this.Department.name ||
  //         Result.description !== this.Department.description
  //         && Result.department_ID == this.Department.department_ID) {
  //         this.dataService.EditDepartment(this.Department.department_ID, this.Department).subscribe({
  //           next: (response) => {
  //             var action = "Update";
  //             var title = "UPDATE SUCCESSFUL";
  //             var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + this.Department.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

  //             const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //               disableClose: true,
  //               data: { action, title, message }
  //             });

  //             const duration = 1750;
  //             setTimeout(() => {
  //               this.router.navigate(['/ViewDepartment']);
  //               dialogRef.close();
  //             }, duration);

  //           }
  //         });

  //       }


  //     }
  //   })





  // }

  onSubmit(){
    var name = this.myForm.get('name')?.value;

    this.dataService.EditDepartmentValidation(name, this.Department.department_ID).subscribe({
      next: (Result) => {
        if (Result == null) {

          console.log(Result)
          console.log(this.Department.department_ID)
          console.log(this.myForm.value)
          this.dataService.EditDepartment(this.Department.department_ID, this.myForm.value).subscribe({
            next: (response) => {

              document.getElementById('AnimationBtn').classList.toggle("is_active");
              document.getElementById('cBtn').style.display = "none";

              this.log.action = "Edited Department: " + name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewDepartment']);
                    dialogRef.close();
                  }, duration);
                }
              }) 
            }
          })
        }
        else if (Result.department_ID == this.route.snapshot.params['department_ID'] && Result.name == name) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to the department: <strong>" + name + "</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            this.router.navigate(['/ViewDepartment']);
            dialogRef.close();
          }, duration);
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Department Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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
    });

  }


 

  openEditDepartmentTab(): void {
    const userManualUrl = 'assets/PDF/EditDepartmentUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
