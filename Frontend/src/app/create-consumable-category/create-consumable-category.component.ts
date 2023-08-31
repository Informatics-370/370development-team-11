import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Consumable } from '../Shared/Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-create-consumable-category',
  templateUrl: './create-consumable-category.component.html',
  styleUrls: ['./create-consumable-category.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateConsumableCategoryComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ConsumableCategory: ConsumableCategory = {
    consumable_Category_ID: 0,
    name: '',
    description: '',
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]]
    })

  }

  AddCategory() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.ConsumableCategory.name = this.myForm.get('Name')?.value;
    this.ConsumableCategory.description = this.myForm.get('Description')?.value;


    this.dataService.CategoryValidation(this.ConsumableCategory.name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.CreateCategory(this.ConsumableCategory).subscribe(
            (CategoryAdded) => {

              if (CategoryAdded) {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
              }

              this.log.action = "Created Consumable Category: " + this.ConsumableCategory.name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (response) => {
                  if (response) {
                    var action = "CREATE";
                    var title = "CREATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.ConsumableCategory.name + "</strong> has been <strong style='color:green'> ADDED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      this.router.navigate(['/ViewConsumableCategory']);
                      dialogRef.close();
                    }, duration);
                  }
                }
              })


            }
          );
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Category Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.ConsumableCategory.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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
    this.router.navigate(['/ViewConsumableCategory']);
  }



  openCreateConCatTab(): void {
    const userManualUrl = 'assets/PDF/CreateConumableCategoryUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
