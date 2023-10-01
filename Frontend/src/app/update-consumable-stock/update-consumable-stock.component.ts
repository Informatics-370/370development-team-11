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
import { DatePipe } from '@angular/common';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { Notification } from '../Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { User } from '../Shared/User';
import { Role } from '../Shared/EmployeeRole';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';

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
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
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
  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }
  Access: Access = {
    Access_ID: 0,
    IsAdmin: '',
    CanAccInv: '',
    CanAccFin: '',
    CanAccPro: '',
    CanAccVen: '',
    CanAccRep: '',
    CanViewPenPro: '',
    CanViewFlagPro: '',
    CanViewFinPro: '',
    CanAppVen: '',
    CanEditVen: '',
    CanDeleteVen: '',
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
    role: this.rl
  }

  Notification_Type: Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }


  ComsumableNotif: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  }
  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  mychart;
  MaxDate: Date;

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      StockLevel: [0, [Validators.required, Validators.pattern("^[0-9]+$")]],
      DateCaptured: [0, [Validators.required]],

    })
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    this.MaxDate = new Date(currentYear, currentMonth, currentDay);


    this.dataservice.GetConsumablePredictions(this.data.ID).subscribe({
      next: (item) => {

        this.Data = item
        return this.Data;
      },
      error: (error) => {
        this.mychart = null;
      }
    })


  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      if (this.data != null) {
        setTimeout(() => {
          this.populateChartData(this.Data);

        });
      }
      if (this.mychart) {
        this.mychart.destroy()
      }
    }

    this.ngOnInit()
  }

  populateChartData(Data: any[]) {

    let labelsData: string[] = [];
    let labelsPopulation: Number[] = [];
    let ActualsData: Number[] = [];

    Data.forEach((element: any) => {

      const monthName = this.getMonthName(element.Month);
      labelsData.push(monthName + "," + element.Year)
      labelsPopulation.push(element.PredictedAmount)
      ActualsData.push(element.ActualAmount)
    });

    this.mychart = new Chart("linechart", {
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
        animation: {
          duration: 0
        },
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
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.dataservice.GetConsumableByID(this.data.ID).subscribe({
      next: (response) => {
        this.dataservice.GetCategoryByID(response.consumable_Category_ID).subscribe({
          next: (result) => {
            this.Consumables.name = response.name
            this.Consumables.consumable_Category.name = result.name

            this.History.stockAmt = this.myForm.get('StockLevel')?.value;
            this.History.dateCaptured = this.myForm.get("DateCaptured")?.value;

            let test: any
            test = new DatePipe('en-ZA');
            this.History.dateCaptured = test.transform(this.History.dateCaptured, 'MMM d, y, h:mm:ss a');

            this.History.consumable = this.Consumables


            this.dataservice.UpdateStock(this.History).subscribe({
              next: (response) => {
                this.ComsumableNotif.notification_Type_ID = 4;
                let transVar: any
                transVar = new DatePipe('en-ZA');
                if (this.Consumables.minimum_Reorder_Quantity >= this.Consumables.on_Hand) {
                  this.ComsumableNotif.send_Date = transVar.transform(new Date(), 'MM d, y, h:mm:ss a');
                  this.ComsumableNotif.name = "The stock level for " + this.Consumables.name + " has reached the minimum amount. Please Re-Order!";
                  this.ComsumableNotif.user_ID = 1;

                  this.dataservice.ConsumableAddNotification(this.ComsumableNotif).subscribe({
                    next: (LowStock) => {
                      this.log.action = "Edited Procurement Request: " + this.Consumables.name;
                      this.log.user = this.dataservice.decodeUser(sessionStorage.getItem("token"));
                      let test: any
                      test = new DatePipe('en-ZA');
                      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                      this.dataservice.AuditLogAdd(this.log).subscribe({
                        next: (Log) => {
                          document.getElementById('AnimationBtn').classList.toggle("is_active");
                          document.getElementById('cBtn').style.display = "none";
                          this.dialogRef.close();
                          this.router.navigate(['/ViewConsumable'])
                        }
                      })


                    }
                  })
                }
                else {
                  document.querySelector('button').classList.toggle("is_active");
                  this.dialogRef.close();
                  this.router.navigate(['/ViewConsumable'])
                }

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
