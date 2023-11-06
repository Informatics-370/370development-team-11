import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-dynamic-create-department',
  templateUrl: './dynamic-create-department.component.html',
  styleUrls: ['./dynamic-create-department.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class DynamicCreateDepartmentComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DynamicCreateDepartmentComponent>, private ActRoute: ActivatedRoute, private router: Router, private dataService: DataService, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });
  }

  onDynamicDepSubmit() {

    

    var name = this.myForm.get('name')?.value;

    this.dataService.DepartmentValidation(name).subscribe({
      next: (Result) => {
        if (Result == null) {
          console.log(this.myForm.value)
          this.dataService.AddDepartments(this.myForm.value).subscribe({
            next: (response) => {
              if (response) {
                document.getElementById('DynamicDepAnimationBtn').classList.toggle("is_active");
                document.getElementById('DynamicDepcBtn').style.display = "none";
              }

              this.log.action = "Created Department: " + name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  this.dialogRef.close(response);

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

          const dynamicDialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dynamicDialogRef.close();
          }, duration);
        }
      }
    })


  }

  public myDynamicDepError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close(): void {
    this.dialogRef.close();
  }

  openCreateDepartmentTab(): void {
    const userManualUrl = 'assets/PDF/CreateDepartmentUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
