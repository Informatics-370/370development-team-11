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
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-edit-consumable',
  templateUrl: './edit-consumable.component.html',
  styleUrls: ['./edit-consumable.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class EditConsumableComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  displayedColumns: string[] = ['Name', 'Description', 'On Hand', 'Minimum Reorder Quantity', 'Maximum Reorder Quantity', 'Category', 'action', 'delete'];
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ConsumableToEdit: Consumable = {
    consumable_ID: 0,
    consumable_Category_ID: 0,
    name: '',
    description: '',
    on_Hand: 0,
    minimum_Reorder_Quantity: 0,
    maximum_Reorder_Quantity: 0,
    consumable_Category: { consumable_Category_ID: 0, name: "", description: "" }
  }

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

  consumableCategoryArray: ConsumableCategory[] = [];
  ngOnInit(): void {

    this.GetCategories();

    // Function to build the table
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      On_Hand: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Minimum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Maximum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      ConsumableCategory: ['', [Validators.required]]
    })

    // Function to get the Consumable data
    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {
        const id = paramater.get("consumable_ID");
        console.log(id)

        if (id) {
          this.dataService.GetConsumableByID(Number(id)).subscribe({
            next: (ConsumableRecieved) => {
              this.ConsumableToEdit = ConsumableRecieved

              const CategoryID = Number(this.ConsumableToEdit.consumable_Category_ID);
              const CategoryIndex = this.consumableCategoryArray.findIndex((category) => category.consumable_Category_ID === CategoryID);

              this.myForm.get('ConsumableCategory')?.setValue(this.consumableCategoryArray[CategoryIndex].name);
            }
          })
        }
      }
    })



  }

  updateConsumable() {

    this.ConsumableCategory.name = this.myForm.get('ConsumableCategory')?.value;
    this.ConsumableToEdit.name = this.myForm.get('Name')?.value;
    this.ConsumableToEdit.description = this.myForm.get('Description')?.value;
    this.ConsumableToEdit.on_Hand = this.myForm.get('On_Hand')?.value;
    this.ConsumableToEdit.minimum_Reorder_Quantity = this.myForm.get('Minimum_Reorder_Quantity')?.value;
    this.ConsumableToEdit.maximum_Reorder_Quantity = this.myForm.get('Maximum_Reorder_Quantity')?.value;
    this.ConsumableToEdit.consumable_Category = this.ConsumableCategory;

    this.dataService.ConsumableValidation(this.ConsumableToEdit.name, this.ConsumableToEdit.consumable_Category.name).subscribe({
      next: (Result) => {
        console.log(Result)
        console.log(this.ConsumableToEdit)

        if (Result == null) {
          this.dataService.UpdateConsumable(this.ConsumableToEdit.consumable_ID, this.ConsumableToEdit).subscribe({
            next: (response) => {
              this.log.action = "Edited Consumable: " + this.ConsumableToEdit.name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  console.log(null)
                  var action = "Update";
                  var title = "UPDATE SUCCESSFUL";
                  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.ConsumableToEdit.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                    disableClose: true,
                    data: { action, title, message }
                  });

                  const duration = 1750;
                  setTimeout(() => {
                    this.router.navigate(['/ViewConsumable']);
                    dialogRef.close();
                  }, duration);
                }
              })


            }
          });
        }
        else {
          if (Result.consumable_ID === this.ConsumableToEdit.consumable_ID && (Result.name !== this.ConsumableToEdit.name ||
            Result.description !== this.ConsumableToEdit.description ||
            Result.maximum_Reorder_Quantity !== this.ConsumableToEdit.maximum_Reorder_Quantity ||
            Result.minimum_Reorder_Quantity !== this.ConsumableToEdit.minimum_Reorder_Quantity ||
            Result.on_Hand !== this.ConsumableToEdit.on_Hand)) {
            this.dataService.UpdateConsumable(this.ConsumableToEdit.consumable_ID, this.ConsumableToEdit).subscribe({
              next: (response) => {

                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");
                console.log("Some other")
                var action = "Update";
                var title = "UPDATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.ConsumableToEdit.name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  this.router.navigate(['/ViewConsumable']);
                  dialogRef.close();
                }, duration);

              }
            });

          }

          if (Result.consumable_ID === this.ConsumableToEdit.consumable_ID &&
            Result.consumable_Category_ID === this.ConsumableToEdit.consumable_Category_ID &&
            Result.name === this.ConsumableToEdit.name &&
            Result.description === this.ConsumableToEdit.description &&
            Result.maximum_Reorder_Quantity === this.ConsumableToEdit.maximum_Reorder_Quantity &&
            Result.minimum_Reorder_Quantity === this.ConsumableToEdit.minimum_Reorder_Quantity &&
            Result.on_Hand === this.ConsumableToEdit.on_Hand) {
            console.log("No Changes")
            var action = "NOTIFICATION";
            var title = "NOTIFICATION: NO CHANGES MADE";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Changes Made to the consumable: <strong>" + this.ConsumableToEdit.name + "</strong>");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 1750;
            setTimeout(() => {
              this.router.navigate(['/ViewConsumable']);
              dialogRef.close();
            }, duration);
          }
          else if (Result.consumable_ID !== this.ConsumableToEdit.consumable_ID || (Result.name === this.ConsumableToEdit.name &&
            Result.description === this.ConsumableToEdit.description &&
            Result.maximum_Reorder_Quantity === this.ConsumableToEdit.maximum_Reorder_Quantity &&
            Result.minimum_Reorder_Quantity === this.ConsumableToEdit.minimum_Reorder_Quantity &&
            Result.on_Hand === this.ConsumableToEdit.on_Hand)) {
            console.log("Error")
            var action = "ERROR";
            var title = "ERROR: Consumable Exists";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.ConsumableToEdit.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

      }
    })


  }

  GetCategories() {
    this.dataService.GetCategories().subscribe(result => {
      let CategoryList: any[] = result
      CategoryList.forEach((element) => {
        this.consumableCategoryArray.push(element)
        console.log(element)
      })
    })
  }
  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewConsumable']);
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }





  openEditConTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
