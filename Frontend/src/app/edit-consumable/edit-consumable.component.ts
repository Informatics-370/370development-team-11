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


@Component({
  selector: 'app-edit-consumable',
  templateUrl: './edit-consumable.component.html',
  styleUrls: ['./edit-consumable.component.css']
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

  consumableCategoryArray: ConsumableCategory[] = [];
  ngOnInit(): void {

    this.GetCategories();

    // Function to build the table
    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-Z ]+$")]],
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
              this.myForm.get('ConsumableCategory')?.setValue(this.consumableCategoryArray[Number(this.ConsumableToEdit.consumable_Category_ID) - 1].name);
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

    this.dataService.UpdateConsumable(this.ConsumableToEdit.consumable_ID, this.ConsumableToEdit).subscribe({
      next: (response) => {
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
}
