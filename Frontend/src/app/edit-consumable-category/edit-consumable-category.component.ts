import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Consumable } from '../Shared/Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-consumable-category',
  templateUrl: './edit-consumable-category.component.html',
  styleUrls: ['./edit-consumable-category.component.css']
})
export class EditConsumableCategoryComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  displayedColumns: string[] = ['Name', 'Description', 'action', 'delete'];
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  CategoryToEdit: ConsumableCategory = {
    consumable_Category_ID: 0,
    name: '',
    description: '',
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]]
    })

    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        const id = paramater.get("consumable_Category_ID");
        console.log(id)

        if (id) {
          this.dataService.GetCategoryByID(Number(id)).subscribe({
            next: (ConsumableRecieved) => {
              this.CategoryToEdit = ConsumableRecieved
            }
          })
        }
      }
    })
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  UpdateCategory() {

    this.dataService.CategoryValidation(this.CategoryToEdit.name).subscribe({
      next: (Result) => {
        console.log(Result)
        console.log(this.CategoryToEdit)
        if (Result == null) {
          this.dataService.UpdateCategory(this.CategoryToEdit.consumable_Category_ID, this.CategoryToEdit).subscribe({
            next: (response) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.CategoryToEdit.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
          });
        }
        if (Result.consumable_Category_ID !== this.CategoryToEdit.consumable_Category_ID && Result.name === this.CategoryToEdit.name) {
          var action = "ERROR";
          var title = "ERROR: Consumable Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.CategoryToEdit.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }

        else if (Result.name === this.CategoryToEdit.name &&
          Result.description === this.CategoryToEdit.description) {
          var action = "NOTIFICATION";
          var title = "NOTIFICATION: NO CHANGES MADE";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to the category: <strong>" + this.CategoryToEdit.name + "</strong>");

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
        else if (Result.name !== this.CategoryToEdit.name ||
          Result.description !== this.CategoryToEdit.description
          && Result.consumable_Category_ID == this.CategoryToEdit.consumable_Category_ID) {
          this.dataService.UpdateCategory(this.CategoryToEdit.consumable_Category_ID, this.CategoryToEdit).subscribe({
            next: (response) => {
              var action = "Update";
              var title = "UPDATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The category <strong>" + this.CategoryToEdit.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

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
          });

        }



      }
    })
  }

  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewConsumableCategory']);
  }

}
