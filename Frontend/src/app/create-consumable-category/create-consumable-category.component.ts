import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Consumable } from '../Shared/Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-create-consumable-category',
  templateUrl: './create-consumable-category.component.html',
  styleUrls: ['./create-consumable-category.component.css']
})
export class CreateConsumableCategoryComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ConsumableCategory: ConsumableCategory = {
    consumable_Category_ID: 0,
    name: '',
    description: '',
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]]
    })

  }

  AddCategory() {
    this.ConsumableCategory.name = this.myForm.get('Name')?.value;
    this.ConsumableCategory.description = this.myForm.get('Description')?.value;


    this.dataService.CategoryValidation(this.ConsumableCategory.name, this.ConsumableCategory.description).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.CreateCategory(this.ConsumableCategory).subscribe(
            (CategoryAdded) => {
              console.log(CategoryAdded);
              this.router.navigate(['/ViewConsumableCategory']);
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
}
