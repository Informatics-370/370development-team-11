import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Consumable } from '../Shared/Consumable';
import { BudgetAllocation } from '../Shared/BudgetAllocation';

@Component({
  selector: 'app-place-procurement-request-create-details',
  templateUrl: './place-procurement-request-create-details.component.html',
  styleUrls: ['./place-procurement-request-create-details.component.css']
})
export class PlaceProcurementRequestCreateDetailsComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,private ProcureService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

  ProcurementFormGroup = this._formBuilder.group({
    BuyerName: ['',[Validators.required,Validators.pattern]],
    BuyerEmail: ['',[Validators.required,Validators.email]],
    ItemType: ["",[Validators.required]],
    ConsumableItem:['',[Validators.required,Validators.pattern]],
    ConsumableQuantity: [0,[Validators.required]],
    AssetName:['',[Validators.required,Validators.pattern]],
    AccountCode:[0,[Validators.required]],
    PaymentType: [0,[Validators.required]],
    HasDeposit:[false],
    DepositAmount: [0,[Validators.required]],
    DepositDueDate: [Date.now(),[Validators.required]],
    FullPaymentMade: false,
    PaidOnDate:[Date.now(),[Validators.required]],
    UploadReceiptDoc: ['',[Validators.required]],
    ProofOfPayment:false,
    ProofOfPaymentMadeDoc: ['',[Validators.required]],
    TotalAmount: [0,[Validators.required]],
    TotalAmountDueDate:[Date.now(),[Validators.required]],
    Comments:["",[Validators.required]],
  });

  ConsumableItems:Consumable[] = [];
  BudgetAllocationCode:BudgetAllocation[] = [];
  ConsumableChecked =true;
  AssetChecked=false;

  ngOnInit() { 
    this.ProcureService.GetConsumables().subscribe(response => {
      this.ConsumableItems = response
      console.log(this.ConsumableItems)
    })
    this.ProcureService.GetBudgetAllocations().subscribe(response => {
      this.BudgetAllocationCode = response;
      console.log(this.BudgetAllocationCode)
    })
  }

  CheckChange() {
    if(this.ProcurementFormGroup.get("ItemType")?.value == "Consumable") {
      this.ConsumableChecked = true;
      this.AssetChecked = false;
      
    }
    else {
      this.AssetChecked = true;
      this.ConsumableChecked = false;
    }
  }

  

}
