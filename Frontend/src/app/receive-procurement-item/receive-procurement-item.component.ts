import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Consumable } from '../Shared/Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Consumable_History } from '../Shared/Consumable_History';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { ActivatedRoute } from '@angular/router';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { DatePipe } from '@angular/common';
import { UpdateConsumableStockComponent } from '../update-consumable-stock/update-consumable-stock.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';


export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-receive-procurement-item',
  templateUrl: './receive-procurement-item.component.html',
  styleUrls: ['./receive-procurement-item.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ReceiveProcurementItemComponent {
  myForm: FormGroup = new FormGroup({});
  consumableCategories: any[] = [];
  ConsumableRequest: Procurement_Consumable;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private dataService: DataService, private router: Router, private sanitizer: DomSanitizer) { }

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
  History: Consumable_History = {
    Consumable_ID: 0,
    history_ID: 0,
    DateCaptured: new Date(),
    StockAmt: 0,
    consumable: {
      consumable_ID: 0,
      consumable_Category_ID: 0,
      name: '',
      description: '',
      on_Hand: 0,
      minimum_Reorder_Quantity: 0,
      maximum_Reorder_Quantity: 0,
      consumable_Category: { consumable_Category_ID: 0, name: "", description: "" }
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetConsumable(id);
    // this.GetCategories();

    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      On_Hand: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Minimum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      Maximum_Reorder_Quantity: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      ConsumableCategory: ['', [Validators.required]]
    })



  }

  // GetCategories() {
  //   this.dataService.GetCategories().subscribe(result => {
  //     let CategoryList: any[] = result
  //     CategoryList.forEach((element) => {
  //       this.consumableCategories.push(element)
  //       console.log(element)
  //     })
  //   })
  // }

  GetConsumable(id: number) {
    this.dataService.GetConsumablesForRequest(id).subscribe(result => {
      this.ConsumableRequest = result;
    })
  }

  updateStock() {
    console.log("hi");
    this.dataService.GetConsumableByID(this.ConsumableRequest.consumable.consumable_ID).subscribe({
      next: (response) => {
        this.dataService.GetCategoryByID(response.consumable_Category_ID).subscribe({
          next: (result) => {
            this.Consumables.name = response.name
            this.Consumables.consumable_Category.name = result.name
            console.log(this.Consumables)

            this.History.StockAmt = this.myForm.get('On_Hand')?.value;

            let test: any
            test = new DatePipe('en-ZA');
            this.History.DateCaptured = test.transform(this.History.DateCaptured, 'MMM d, y, h:mm:ss a');

            this.History.consumable = this.Consumables

            console.log(this.History)

            this.dataService.UpdateStock(this.History).subscribe({
              next: (response) => {
                console.log(response)
                // document.querySelector('button').classList.toggle("is_active");
                // this.dialogRef.close();
                this.router.navigate(['/ViewConsumable'])

              }
            })
          }
        })
      }
    })
  }

  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementDetails']);
  }


  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}