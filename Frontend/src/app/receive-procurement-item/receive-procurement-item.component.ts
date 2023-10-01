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
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { Role } from '../Shared/EmployeeRole';
import { Access } from '../Shared/Access';
import { User } from '../Shared/User';
import { Notification_Type } from '../Shared/Notification_Type';
import { Notification } from '../Shared/Notification';

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
  Details: Procurement_Details;

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
  ProcurementID: Number = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ProcurementID = id;
    this.GetConsumable(id);

    this.myForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), Validators.pattern("^[a-zA-Z ]+$")]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      On_Hand: [0, [Validators.required, Validators.pattern("^[0-9]+$")]]
    })

    this.myForm.get('Name').disable();
    this.myForm.get('Description').disable();
  }

  GetConsumable(id: number) {
    this.dataService.GetConsumablesForRequestConsRecieve(id).subscribe(result => {
      this.ConsumableRequest = result;
      this.Details = result.procurement_Details
    })
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

  VendorNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };

  updateStock() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    this.dataService.GetConsumableHistoryByID(this.ConsumableRequest.consumable.consumable_ID).subscribe({
      next: (Hist) => {

        this.HistAmt = Hist.stockAmt

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



                this.dataService.UpdateStock(this.History).subscribe({
                  next: (response) => {
                    document.getElementById('AnimationBtn').classList.toggle("is_active");
                    document.getElementById('cBtn').style.display = "none";
                    this.dataService.UpdateProcurementStatus(5, this.ProcurementID).subscribe({
                      next: (Result) => {
                        this.VendorNotification.notification_Type_ID = 19;
                        let transVar: any
                        transVar = new DatePipe('en-ZA');
                        this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
                        this.VendorNotification.name = "Procurement Request " +this.ProcurementID + " has been received and can be finalised.";
                        this.dataService.GetUserByRole("Finance").subscribe(r => {
                          var user: any = r;

                          this.VendorNotification.user_ID = user.user_Id;
                          this.dataService.ProcurementAddNotification(this.VendorNotification).subscribe();
                          this.router.navigate(['/ViewProcurementDetails'])
                        }) 

                        
                      }
                    })


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


  public onFocus(event: FocusEvent) {
    (event.target as any).blur();
  }


  openRecieveConsumableTab(): void {
    const userManualUrl = 'assets/PDF/ProcConsumableReceiveUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
