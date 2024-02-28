import { Component , OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from 'src/app/DataService/data-service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { Department } from 'src/app/Shared/Department';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateDepartmentComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(private router: Router, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });
  }
  

  onSubmit() {

    

    var name = this.myForm.get('name')?.value;

    this.dataService.DepartmentValidation(name).subscribe({
      next: (Result) => {
        if (Result == null) {

          this.dataService.AddDepartments(this.myForm.value).subscribe({
            next: (response) => {
              if (response) {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
              }

              this.log.action = "Created Department: " + name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  var action = "Create";
                  var title = "CREATED SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

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
        else {
          document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
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
    })


  }
 
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
  
  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewDepartment');
  }



  openCreateDepartmentTab(): void {
    const userManualUrl = 'assets/PDF/CreateDepartmentUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
