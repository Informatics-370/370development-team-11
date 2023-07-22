import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Consumable } from '../Shared/Consumable';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import {Procurement_Details} from "../Shared/ProcurementDetails";
import { Employee } from '../Shared/Employee';
import { User } from '../Shared/User';
import { Role } from '../Shared/EmployeeRole';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { Department } from '../Shared/Department';
import { Branch } from '../Shared/Branch';
import { MailData } from '../Shared/Mail';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Sign_Off_Status } from '../Shared/SignOffStatus';
import { Procurement_Payment_Status } from '../Shared/ProcurementPaymentStatus';
import { Procurement_Status } from '../Shared/ProcurementStatus';
import { Payment_Method } from '../Shared/PaymentMethod';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { DatePipe } from '@angular/common';
import { Deposit } from '../Shared/Deposit';
import { Payment_Made } from '../Shared/PaymentMade';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Vendor_Consumable } from '../Shared/Vendor_Consumable';
import { Asset } from '../Shared/Asset';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Vendor_Asset } from '../Shared/Vendor_Asset';
@Component({
  selector: 'app-place-procurement-request-create-details',
  templateUrl: './place-procurement-request-create-details.component.html',
  styleUrls: ['./place-procurement-request-create-details.component.css']
})
export class PlaceProcurementRequestCreateDetailsComponent implements OnInit {

  

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }

  br: Branch = {
    branch_ID: 0,
    name: '',
    street: '',
    city: '',
    postal_Code: '',
    province: '',
  }

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  ml: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249Z',
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    role: this.rl
  }

  EmployeeDetails: Employee = {
    employeeID: 0,
    user_Id: 0,
    department_ID: 0,
    branch_ID: 0,
    mandate_ID: 0,
    employeeName: '',
    employeeSurname: '',
    cellPhone_Num: '',
    email: '',
    branch: this.br,
    department: this.dep,
    user: this.usr,
    mandate_limit: this.ml
  }

  Procurement_Request: Procurement_Request = {
    procurement_Request_ID: 0,
    vendor_ID: 0,
    vendor: {
      vendor_ID: 0,
      vendor_Status_ID: 0,
      vendor_Status: {
        vendor_Status_ID: 0,
        name: "",
        description: ""
      },
      name: "",
      email: "",
      number_Of_Times_Used: 0,
      sole_Supplier_Provided: false,
      preferedVendor: true
    },
    requisition_Status_ID: 0,
    requisition_Status: {
      requisition_Status_ID: 0,
      name: "Approval Required",
      description: ""
    },
    user_ID: 0,
    user: {
      user_Id: 0,
      role_ID: 0,
      username: "",
      password: "",
      profile_Picture: "",
      no_Notifications: 0,
      role: {
        role_ID: 0,
        name: "",
        description: ""
      }
    },
    name: "",
    description: ""
  }

  SignOffStatus:Sign_Off_Status = {
    sign_Off_Status_ID:0,
    name:"",
    description:"",
  }

  Procurement_Payment_Status:Procurement_Payment_Status = {
    procurement_Payment_Status_ID:0,
    name:"",
    description:"",
  }

  Procurement_Status:Procurement_Status = {
    procurement_Status_ID:0,
    name:"",
    description:"",
  }

  Payment_Method:Payment_Method = {
    payment_Method_ID:1,
    name:"",
    description:"",
  }

  category: BudgetCategory = {
    category_ID: 0,
    account_Name: '',
    description: ''
  }

  budgetAllocation: BudgetAllocation = {
    budget_ID: 0,
    department_ID: 0,
    date_Created: '2023-05-07T12:14:46.249Z',
    year: 0,
    total: 0,
    department: this.dep
  }


  budgetLine: BudgetLine = {
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
    account_Code: 0,
    budget_Category: this.category,
    month: '',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  ProcurementDetails:Procurement_Details = {
    procurement_Details_ID:0,
     employeeID:0, 
     procurement_Request_ID:0,
     sign_Off_Status_ID :0,
     procurement_Payment_Status_ID:0,
     account_Code:0,
     procurement_Status_ID:0,
     payment_Method_ID:0,
     employee: this.EmployeeDetails,
     procurement_Request: this.Procurement_Request,
     sign_Off_Status: this.SignOffStatus, 
     procurement_Payment_Status: this.Procurement_Payment_Status,
     budget_Line: this.budgetLine,
     procurement_Status: this.Procurement_Status,
     payment_Method: this.Payment_Method,
     item_Type:"Consumable",
     buyer_Name:"",
     buyer_Email: "",
     deposit_Required:false, 
     full_Payment_Due_Date:new Date(),
     total_Amount:0,
     payment_Made:false,
     comment:"", 
     proof_Of_Payment_Required:false,
  }

  Deposit:Deposit = {
    procurement_Deposit_ID:0,
     procurement_Details_ID:0,
     procurement_Details:this.ProcurementDetails,
     deposit_Due_Date:new Date(),
     deposit_Amount:0,
     amount_Outstanding:0,
  }

  PaymentMade:Payment_Made = {
    payment_Made_ID:0,
    procurement_Details_ID :0,
    procurement_Details:this.ProcurementDetails,
    paid_On_Date:new Date(),
    receipt_Upload:"",
  }

  ProofOfPayment:Proof_Of_Payment = {
    proof_Of_Payment_ID:0,
    procurement_Details_ID:0,
    procurement_Details:this.ProcurementDetails,
    Proof_Of_Payment_Doc:"",
  }

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

  Procurement_Consumable: Procurement_Consumable = {
    procurement_Consumable_ID:0,
    procurement_Details_ID:0,
    consumable_ID:0,
    procurement_Details:this.ProcurementDetails,
    consumable:this.Consumables,
    quantity:0,
  }

  Vendor_Consumable:Vendor_Consumable = {
    vendor_Consumbale_ID:0,
    consumable_ID:0,
    vendor_ID:0,
    consumables:this.Consumables,
    vendor:this.Procurement_Request.vendor,
  }

  assets:Asset = {
    asset_ID:0,
    name:'',
    description:'',
  }

  procurment_assets:Procurement_Asset = {
    procurement_Asset_ID:0,
    procurement_Details_ID:0,
    asset_ID:0,
    procurement_Details:this.ProcurementDetails,
    asset:this.assets,
  }

  vendor_asset:Vendor_Asset = {
    vendor_Asset_ID:0,
    asset_ID:0,
    vendor_ID:0,
    asset:this.assets,
    vendor:this.Procurement_Request.vendor,
  }

  constructor(private _formBuilder: FormBuilder,private ProcureService: DataService,private route: ActivatedRoute ,private router: Router,private dialog:MatDialog, private sanitizer:DomSanitizer) {}

  ProcurementFormGroup = this._formBuilder.group({
    BuyerName: ["",[Validators.required]],
    BuyerEmail: ["",[Validators.required,Validators.email]],
    ItemType: ["",[Validators.required]],
    ConsumableItem:["",[Validators.required]],
    ConsumableQuantity: [0,[Validators.required]],
    AssetName:["",[Validators.required]],
    AssetDescription:[""],
    AccountCode:[0,[Validators.required]],
    PaymentType: [0,[Validators.required]],
    HasDeposit:[false],
    DepositAmount: [0,[Validators.required]],
    DepositDueDate: [Date.now(),[Validators.required]],
    FullPaymentMade: false,
    PaidOnDate:[Date.now(),[Validators.required]],
    UploadReceiptDoc: ["",[Validators.required]],
    ProofOfPayment:false,
    ProofOfPaymentDoc: ["",[Validators.required]],
    TotalAmount: [0,[Validators.required]],
    TotalAmountDueDate:[Date.now(),[Validators.required]],
    Comments:["",[Validators.required]],
  });


  ConsumableItems:Consumable[] = [];
  BudgetAllocationCode:BudgetLine[] = [];
  ConsumableChecked =true;
  AssetChecked=false;
  ProcurementRequest_ID = 0;
  ngOnInit() { 
    var User = this.ProcureService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
    this.ProcureService.GetConsumables().subscribe(response => {
      this.ConsumableItems = response
      console.log(this.ConsumableItems)
    })
    this.ProcureService.GetBudgetLines().subscribe(response => {
      this.BudgetAllocationCode = response;
      console.log(this.BudgetAllocationCode)
    })

    this.ProcureService.GetEmployeeByUsername("WeSc746").subscribe(result => {
      let employeeInfo:any = result;
      this.EmployeeDetails = employeeInfo;
      console.log(this.EmployeeDetails);
    })
    this.ProcureService.GetProcurementRequestByID(1).subscribe(result => {
      console.log(result)
      this.Procurement_Request = result
      console.log(this.Procurement_Request)
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
  file:File[] = [null,null];
  uploadFile(i:number,event:any) {
    this.file[i] = event.target.files[0] ;
    console.log(this.file[i])
  }


  Create() {
    let dateChange: any
    dateChange = new DatePipe('en-ZA');
    //Data values
    this.ProcurementDetails.buyer_Name = this.ProcurementFormGroup.get("BuyerName")?.value;
    this.ProcurementDetails.buyer_Email = this.ProcurementFormGroup.get("BuyerEmail")?.value;
    this.ProcurementDetails.item_Type = this.ProcurementFormGroup.get("ItemType")?.value;
    this.ProcurementDetails.deposit_Required = this.ProcurementFormGroup.get("HasDeposit")?.value;
    this.ProcurementDetails.payment_Made = this.ProcurementFormGroup.get("FullPaymentMade")?.value;
    this.ProcurementDetails.comment = this.ProcurementFormGroup.get("Comments")?.value;
    this.ProcurementDetails.total_Amount = this.ProcurementFormGroup.get("TotalAmount")?.value;
    this.ProcurementDetails.full_Payment_Due_Date = dateChange.transform(this.ProcurementFormGroup.get("TotalAmountDueDate")?.value, 'MM, dd, y');
    this.ProcurementDetails.proof_Of_Payment_Required = this.ProcurementFormGroup.get("ProofOfPayment")?.value;
    //id values

    this.ProcurementDetails.employeeID = this.EmployeeDetails.employeeID;
    //this.ProcurementDetails.employeeID = 2;
   // this.ProcurementDetails.procurement_Request_ID = this.ProcurementRequest_ID;
    this.ProcurementDetails.sign_Off_Status_ID = 1;
    //if statement
    this.ProcurementDetails.procurement_Payment_Status_ID = 1;
    this.ProcurementDetails.procurement_Status_ID = 1;

    this.ProcurementDetails.account_Code = this.ProcurementFormGroup.get("AccountCode")?.value;
    this.ProcurementDetails.payment_Method_ID = this.ProcurementFormGroup.get("PaymentType")?.value;
    this.ProcurementDetails.procurement_Request = this.Procurement_Request;
    this.ProcurementDetails.procurement_Request_ID = Number(this.Procurement_Request.procurement_Request_ID);
    console.log(this.ProcurementDetails)
    this.ProcureService.AddProcurementDetails(this.ProcurementDetails).subscribe(result => {
      console.log(result[0])
      if(this.ProcurementDetails.deposit_Required == true) {
        this.Deposit.deposit_Amount = this.ProcurementFormGroup.get("DepositAmount")?.value;
        this.Deposit.amount_Outstanding = (this.ProcurementFormGroup.get("TotalAmount")?.value - this.ProcurementFormGroup.get("DepositAmount")?.value)
        this.Deposit.procurement_Details = result[0];
        this.Deposit.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
        this.Deposit.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
        this.Deposit.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
        this.Deposit.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
        this.Deposit.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
        this.Deposit.deposit_Due_Date = dateChange.transform(this.ProcurementFormGroup.get("DepositDueDate")?.value, 'MM, dd, y');
        this.Deposit.procurement_Details_ID = result[0].procurement_Details_ID;
        //console.log(this.Deposit)
        this.ProcureService.AddDeposit(this.Deposit).subscribe(check =>{console.log(check)})
      }
      if(this.ProcurementDetails.proof_Of_Payment_Required == true) {
        let FolderCategory = "ProofOfPayment"
        let ProcurementRequest = "ProcurementDetail" + result[0].procurement_Details_ID;

        this.ProcureService.uploadProcureFile(FolderCategory,ProcurementRequest,this.file[1]).subscribe(response => {
          this.ProofOfPayment.procurement_Details = result[0];
          this.ProofOfPayment.procurement_Details_ID = result[0].procurement_Details_ID;
          let Path: any = response
          this.ProofOfPayment.Proof_Of_Payment_Doc = Path.returnedPath.toString()
          this.ProofOfPayment.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
          this.ProofOfPayment.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
          this.ProofOfPayment.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
          this.ProofOfPayment.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
          this.ProofOfPayment.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category;
          this.ProcureService.AddProofOfPayment(this.ProofOfPayment).subscribe();
        })
      }
      if(this.ProcurementDetails.payment_Made == true) {
        let FolderCategory = "PaymentMade";
        let ProcurementRequest = "ProcurementDetail" + result[0].procurement_Details_ID;

        this.ProcureService.uploadProcureFile(FolderCategory,ProcurementRequest,this.file[0]).subscribe(response => {
          let Path: any = response
          this.PaymentMade.receipt_Upload = Path.returnedPath.toString();
          this.PaymentMade.paid_On_Date = dateChange.transform(this.ProcurementFormGroup.get("PaidOnDate")?.value, 'MM, dd, y');
          this.PaymentMade.procurement_Details = result[0]
          this.PaymentMade.procurement_Details_ID = result[0].procurement_Details_ID;
          this.PaymentMade.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
          this.PaymentMade.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
          this.PaymentMade.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
          this.PaymentMade.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
          this.PaymentMade.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
          this.ProcureService.AddPaymentMade(this.PaymentMade).subscribe();
        })
         
      }
      if(this.ProcurementFormGroup.get("ItemType")?.value == "Consumable") {
        this.Procurement_Consumable.consumable_ID = Number(this.ProcurementFormGroup.get("ConsumableItem")?.value)
        this.Procurement_Consumable.procurement_Details_ID = result[0].procurement_Details_ID;
        this.Procurement_Consumable.procurement_Details = result[0]
        this.Procurement_Consumable.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
        this.Procurement_Consumable.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
        this.Procurement_Consumable.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
        this.Procurement_Consumable.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
        this.Procurement_Consumable.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
        this.Procurement_Consumable.quantity = Number(this.ProcurementFormGroup.get("ConsumableQuantity")?.value)
        this.ConsumableItems.forEach(e=> {
          if(e.consumable_Category_ID == Number(this.ProcurementFormGroup.get("ConsumableItem")?.value) ){
            this.Procurement_Consumable.consumable = e
          }
        })
        this.ProcureService.AddProcurementConsumable(this.Procurement_Consumable).subscribe(r => {console.log(r)})
       
        this.Vendor_Consumable.consumable_ID = Number(this.ProcurementFormGroup.get("ConsumableQuantity")?.value)
        this.ConsumableItems.forEach(e=> {
          if(e.consumable_Category_ID == Number(this.ProcurementFormGroup.get("ConsumableItem")?.value) ){
            this.Vendor_Consumable.consumables = e
          }
        })
        this.Vendor_Consumable.vendor = this.Procurement_Request.vendor;
        this.Vendor_Consumable.vendor_ID = Number(this.Procurement_Request.vendor_ID);
        this.ProcureService.AddVendorConsumable(this.Vendor_Consumable);
      }
      else {
        this.assets.description = this.ProcurementFormGroup.get("AssetDescription")?.value;
        this.assets.name = this.ProcurementFormGroup.get("AssetName")?.value;
        this.ProcureService.AddAsset(this.assets).subscribe(data => {
          this.assets.asset_ID = data[0].asset_ID;
          
          this.procurment_assets.asset = data[0]
          this.procurment_assets.asset_ID = data[0].asset_ID;
          this.procurment_assets.procurement_Details = result[0]
          this.procurment_assets.procurement_Details_ID = result[0].procurement_Details_ID;
          this.procurment_assets.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
          this.procurment_assets.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
          this.procurment_assets.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
          this.procurment_assets.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
          this.procurment_assets.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
          this.ProcureService.AddProcurementAsset(this.procurment_assets).subscribe(r => console.log(r));

          this.vendor_asset.asset= data[0]
          this.vendor_asset.asset_ID = data[0].asset_ID;
          this.vendor_asset.vendor = this.Procurement_Request.vendor;
          this.vendor_asset.vendor_ID = Number(this.Procurement_Request.vendor_ID);
          this.ProcureService.AddVendorAsset(this.vendor_asset).subscribe(r => console.log(r))
        })
      }
    })
  }
  

}

