import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consumable } from '../Shared/Consumable';
import { Consumable_History } from '../Shared/Consumable_History';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { Chart, registerables } from 'node_modules/chart.js';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

Chart.register(...registerables);

@Component({
  selector: 'app-update-consumable-stock',
  templateUrl: './update-consumable-stock.component.html',
  styleUrls: ['./update-consumable-stock.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class UpdateConsumableStockComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, ID: Number }, private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<UpdateConsumableStockComponent>) { }

  Consumable = this.data.name
  Data: any[];
  @ViewChild('myTemp')
  myTempRef!: ElementRef;

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
    this.myForm = this.formBuilder.group({
      StockLevel: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
    })

    this.dataservice.GetConsumablePredictions(this.data.ID).subscribe({
      next: (item) => {

        console.log(item)
        this.Data = item
        console.log(this.Data)
        return this.Data;
      }
    })


  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      setTimeout(() => {
        this.populateChartData(this.Data);
      });
    }

    this.ngOnInit()
  }

  populateChartData(Data: any[]) {

    let labelsData: string[] = [];
    let labelsPopulation: Number[] = [];
    let ActualsData: Number[] = [];
    console.log(Data)

    Data.forEach((element: any) => {

      const monthName = this.getMonthName(element.Month);
      labelsData.push(monthName + "," + element.Year)
      labelsPopulation.push(element.PredictedAmount)
      ActualsData.push(element.ActualAmount)
    });
    console.log(labelsPopulation)

    new Chart("linechart", {
      type: 'line',
      data: {
        labels: labelsData,
        datasets: [{
          label: 'Monthly Prediction Amount',
          data: labelsPopulation,
          borderWidth: 1

        },
        {
          label: 'Historical Monthly Actual Average',
          data: ActualsData,
          borderWidth: 1
        }
        ]

      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Adjust month to match the array index (0-based)
    const adjustedMonth = month - 1;

    // Return the month name
    return monthNames[adjustedMonth];
  }

  updateStock() {
    this.dataservice.GetConsumableByID(this.data.ID).subscribe({
      next: (response) => {
        this.dataservice.GetCategoryByID(response.consumable_Category_ID).subscribe({
          next: (result) => {
            this.Consumables.name = response.name
            this.Consumables.consumable_Category.name = result.name
            console.log(this.Consumables)

            this.History.StockAmt = this.myForm.get('StockLevel')?.value;
            this.History.consumable = this.Consumables

            console.log(this.History)

            this.dataservice.UpdateStock(this.History).subscribe({
              next: (response) => {
                console.log(response)
                document.querySelector('button').classList.toggle("is_active");
                this.dialogRef.close();
                this.router.navigate(['/ViewConsumable'])

              }
            })
          }
        })
      }
    })
  }

  Close() {
    this.dialogRef.close()
    this.router.navigate(['/ViewConsumable'])
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}
