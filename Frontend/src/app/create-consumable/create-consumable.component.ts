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
  selector: 'app-create-consumable',
  templateUrl: './create-consumable.component.html',
  styleUrls: ['./create-consumable.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class CreateConsumableComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  consumableCategories: any[] = [];




  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  Consumables: Consumable = {
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

  ngOnInit(): void {

    this.GetCategories();

    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      On_Hand: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Minimum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Maximum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      ConsumableCategory: ['', [Validators.required]]
    })

  }

  GetCategories() {
    this.dataService.GetCategories().subscribe(result => {
      let CategoryList: any[] = result
      CategoryList.forEach((element) => {
        this.consumableCategories.push(element)

      })
    })
  }
  AddConsumable() {
    
    this.ConsumableCategory.name = this.myForm.get('ConsumableCategory')?.value;
    this.Consumables.name = this.myForm.get('Name')?.value;
    this.Consumables.description = this.myForm.get('Description')?.value;
    this.Consumables.on_Hand = this.myForm.get('On_Hand')?.value;
    this.Consumables.minimum_Reorder_Quantity = this.myForm.get('Minimum_Reorder_Quantity')?.value;
    this.Consumables.maximum_Reorder_Quantity = this.myForm.get('Maximum_Reorder_Quantity')?.value;
    this.Consumables.consumable_Category = this.ConsumableCategory;

    this.dataService.ConsumableValidation(this.Consumables.name, this.Consumables.consumable_Category.name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddConsumables(this.Consumables).subscribe(
            (ConsumableAdded) => {

              if (ConsumableAdded) {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
              }

              this.log.action = "Created Consumable: " + this.Consumables.name;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Response) => {
                  if (Response) {
                    var action = "CREATE";
                    var title = "CREATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.Consumables.name + "</strong> has been <strong style='color:green'> ADDED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      dialogRef.close();
                      this.router.navigate(['/ViewConsumable']);
                    }, duration);
                  }
                }
              })
            }
          );
        }
        else {
          document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
          var action = "ERROR";
          var title = "ERROR: Consumable Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The consumable <strong>" + this.Consumables.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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

  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewConsumable']);
  }


  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }





  openCreateConTab(): void {
    const userManualUrl = 'assets/PDF/CreateConsumableUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
