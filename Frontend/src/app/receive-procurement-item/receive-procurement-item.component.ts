import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Consumable } from '../Shared/Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Consumable_History } from '../Shared/Consumable_History';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { DatePipe } from '@angular/common';
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
    dateCaptured: new Date(),
    stockAmt: 0,
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

  HistAmt: Number = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetConsumable(id);
    console.log(this.GetConsumable(id))

    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      On_Hand: [0, [Validators.required, Validators.pattern("^[0-9]+$")]]
    })



  }

  GetConsumable(id: number) {
    this.dataService.GetConsumablesForRequestConsRecieve(id).subscribe(result => {
      this.ConsumableRequest = result;
      console.log(result)
    })
  }

  updateStock() {
    this.dataService.GetConsumableHistoryByID(this.ConsumableRequest.consumable.consumable_ID).subscribe({
      next: (Hist) => {
        console.log(Hist)
        this.HistAmt = Hist.stockAmt
        console.log(Hist.stockAmt)
        this.dataService.GetConsumableByID(this.ConsumableRequest.consumable.consumable_ID).subscribe({
          next: (response) => {
            this.dataService.GetCategoryByID(response.consumable_Category_ID).subscribe({
              next: (result) => {
                this.Consumables.name = response.name
                this.Consumables.consumable_Category.name = result.name

                this.History.stockAmt = this.myForm.get('On_Hand')?.value + this.HistAmt;

                let test: any
                test = new DatePipe('en-ZA');
                this.History.dateCaptured = test.transform(this.History.dateCaptured, 'MMM d, y, h:mm:ss a');

                this.History.consumable = this.Consumables

                console.log(this.History)

                this.dataService.UpdateStock(this.History).subscribe({
                  next: (response) => {
                    console.log(response)
                    this.router.navigate(['/ViewProcurementDetails'])

                  }
                })
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
