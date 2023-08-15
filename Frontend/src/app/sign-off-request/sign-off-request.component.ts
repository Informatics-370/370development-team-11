import { Component } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consumable } from '../Shared/Consumable';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { Procurement_Details } from "../Shared/ProcurementDetails";
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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Deposit } from '../Shared/Deposit';
import { Payment_Made } from '../Shared/PaymentMade';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Vendor_Consumable } from '../Shared/Vendor_Consumable';
import { Asset } from '../Shared/Asset';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Vendor_Asset } from '../Shared/Vendor_Asset';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';

@Component({
  selector: 'app-sign-off-request',
  templateUrl: './sign-off-request.component.html',
  styleUrls: ['./sign-off-request.component.css']
})
export class SignOffRequestComponent {
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
      access_ID: 0,
      access: this.Access,
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

  SignOffStatus: Sign_Off_Status = {
    sign_Off_Status_ID: 0,
    name: "",
    description: "",
  }

  Procurement_Payment_Status: Procurement_Payment_Status = {
    procurement_Payment_Status_ID: 0,
    name: "",
    description: "",
  }

  Procurement_Status: Procurement_Status = {
    procurement_Status_ID: 0,
    name: "",
    description: "",
  }

  Payment_Method: Payment_Method = {
    payment_Method_ID: 1,
    name: "",
    description: "",
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
    account_Code: '',
    budget_Category: this.category,
    month: '',
    budgetAmt: 0,
    actualAmt: 0,
    variance: 0
  }

  ProcurementDetails: Procurement_Details = {
    procurement_Details_ID: 0,
    employeeID: 0,
    procurement_Request_ID: 0,
    sign_Off_Status_ID: 0,
    procurement_Payment_Status_ID: 0,
    BudgetLineId: 0,
    procurement_Status_ID: 0,
    payment_Method_ID: 0,
    employee: this.EmployeeDetails,
    procurement_Request: this.Procurement_Request,
    sign_Off_Status: this.SignOffStatus,
    procurement_Payment_Status: this.Procurement_Payment_Status,
    budget_Line: this.budgetLine,
    procurement_Status: this.Procurement_Status,
    payment_Method: this.Payment_Method,
    item_Type: "Consumable",
    buyer_Name: "",
    buyer_Email: "",
    deposit_Required: false,
    full_Payment_Due_Date: new Date(),
    total_Amount: 0,
    payment_Made: false,
    comment: "",
    proof_Of_Payment_Required: false,
  }

  Deposit: Deposit = {
    procurement_Deposit_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails,
    deposit_Due_Date: new Date(),
    deposit_Amount: 0,
    amount_Outstanding: 0,
  }

  PaymentMade: Payment_Made = {
    payment_Made_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails,
    paid_On_Date: new Date(),
    receipt_Upload: "",
  }

  ProofOfPayment: Proof_Of_Payment = {
    proof_Of_Payment_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails,
    proof_Of_Payment_Doc: "",
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
    procurement_Consumable_ID: 0,
    procurement_Details_ID: 0,
    consumable_ID: 0,
    procurement_Details: this.ProcurementDetails,
    consumable: this.Consumables,
    quantity: 0,
  }

  // Vendor_Consumable: Vendor_Consumable = {
  //   vendor_Consumbale_ID: 0,
  //   consumable_ID: 0,
  //   vendor_ID: 0,
  //   consumables: this.Consumables,
  //   vendor: this.Procurement_Request.vendor,
  // }

  assets: Asset = {
    asset_ID: 0,
    name: '',
    description: '',
  }

  procurment_assets: Procurement_Asset = {
    procurement_Asset_ID: 0,
    procurement_Details_ID: 0,
    asset_ID: 0,
    procurement_Details: this.ProcurementDetails,
    asset: this.assets,
  }

  vendor_asset: Vendor_Asset = {
    vendor_Asset_ID: 0,
    asset_ID: 0,
    vendor_ID: 0,
    asset: this.assets,
    vendor: this.Procurement_Request.vendor,
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  BudgetAllocationCode: BudgetLine[] = [];
  finalizationForm: FormGroup = new FormGroup({});

  ActualAmountDisplay;
  TotalAmountDisplay
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private currencyPipe: CurrencyPipe) { }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetProcurementDetails(id);
    this.finalizationForm = this.formBuilder.group({
      mandateLimit: ['', [Validators.required]],
      total: ['', [Validators.required]],
      budgetLine: ['', [Validators.required]],
      ProofOfPayment: false,
      ProofOfPaymentDoc: ["", [Validators.required]],
    })

    this.dataService.GetBudgetLines().subscribe(response => {
      this.BudgetAllocationCode = response;
      console.log(this.BudgetAllocationCode)
    })
  }

  onSubmit(): void {
    this.dataService.RequisitionApproval(this.ProcurementDetails.procurement_Details_ID).subscribe(result => {
      // let FolderCategory = "ProofOfPayment"
      // let ProcurementRequest = `ProcurementDetail${result[0].procurement_Details_ID}`
      // console.log(ProcurementRequest)
      // this.dataService.uploadProcureFile(FolderCategory, ProcurementRequest, this.file[1]).subscribe(response => {
      //   this.ProofOfPayment.procurement_Details = result[0];
      //   this.ProofOfPayment.procurement_Details_ID = result[0].procurement_Details_ID;
      //   let Path: any = response
      //   this.ProofOfPayment.proof_Of_Payment_Doc = Path.returnedPath.toString()
      //   this.ProofOfPayment.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
      //   this.ProofOfPayment.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
      //   this.ProofOfPayment.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
      //   this.ProofOfPayment.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
      //   this.ProofOfPayment.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category;
      //   this.dataService.AddProofOfPayment(this.ProofOfPayment).subscribe();
      // })

      this.log.action = "Procurement Sign-Off Completed for Request: " + this.ProcurementDetails.procurement_Details_ID;
      this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
      let test: any
      test = new DatePipe('en-ZA');
      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
      this.dataService.AuditLogAdd(this.log).subscribe({
        next: (Log) => {
          this.router.navigate(['/ViewProcurementDetails']);
        }
      })


    })

  }

  onCancel(): void {
    this.finalizationForm.reset();
    this.router.navigate(['/ViewUnapprovedRequests']);
  }

  GetProcurementDetails(id: number) {
    this.dataService.GetProcurementDetailsByID(id).subscribe(result => {
      this.ProcurementDetails = result;
      this.ActualAmountDisplay = this.ProcurementDetails.budget_Line.actualAmt;
      this.TotalAmountDisplay = this.ProcurementDetails.total_Amount;
      this.ActualAmountDisplay = this.currencyPipe.transform(this.ActualAmountDisplay, 'R');
      this.TotalAmountDisplay = this.currencyPipe.transform(this.TotalAmountDisplay, 'R');
      console.log(result)
    })
  }

  public myError = (controlName: string, errorName: string) => {
    return this.finalizationForm.controls[controlName].hasError(errorName);
  }
}
