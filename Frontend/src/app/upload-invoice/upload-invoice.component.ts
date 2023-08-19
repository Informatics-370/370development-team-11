import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Notification } from '../Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
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
import { DatePipe } from '@angular/common';
import { Deposit } from '../Shared/Deposit';
import { Payment_Made } from '../Shared/PaymentMade';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Vendor_Consumable } from '../Shared/Vendor_Consumable';
import { Asset } from '../Shared/Asset';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Vendor_Asset } from '../Shared/Vendor_Asset';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';
import { Procurement_Invoice } from '../Shared/Procurement_Invoice';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.css']
})
export class UploadInvoiceComponent {
  myForm: FormGroup = new FormGroup({});
  fileToUpload: File | null = null;
  files: any[] = [''];
  sPath = "";

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
    itemReceived: false
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
  pop: Payment_Made = {
    payment_Made_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails,
    paid_On_Date: new Date(),
    receipt_Upload: "",
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  Invoice: Procurement_Invoice = {
    invoice_ID: 0,
    path: "",
    date_Uploaded: new Date(),
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails
  }
  User: String = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, ID: number }, private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<UploadInvoiceComponent>) { }

  File = this.data.name
  Data: any[];
  @ViewChild('myTemp')
  myTempRef!: ElementRef;

  ngOnInit(): void {
    console.log(this.data.ID)
    this.myForm = this.formBuilder.group({
      FileAdded: ["", [Validators.required]],
    });

    this.dataservice.GetProcurementDetailsByID(this.data.ID).subscribe({
      next: (Response) => {
        this.ProcurementDetails = Response;
      }
    })

    this.User = this.dataservice.decodeUser(sessionStorage.getItem("token"))

    this.dataservice.GetUserByUsername(this.User.toString()).subscribe({
      next: (Response) => {
        this.usr = Response;
      }
    })
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      setTimeout(() => {

      });
    }

    this.ngOnInit()
  }

  onFileUpload(event: any) {
    console.log('Event:', event);
    console.log('Event Target:', event.target);
    console.log('Files:', event.target.files);
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onSubmit() {
    this.fileToUpload = this.files[0];
    var name = "" + this.data.name
    if (this.fileToUpload != null) {
      let InvoiceName: string = name

      let file: File = this.fileToUpload

      this.dataservice.InvoiceFileAdd(InvoiceName, file).subscribe(response => {
        let Path: any = response
        this.sPath = Path.pathSaved.toString()
        this.Invoice.path = this.sPath;
        this.Invoice.procurement_Details_ID = this.data.ID;
        this.Invoice.procurement_Details.procurement_Request.user = this.usr;
        this.Invoice.procurement_Details.procurement_Request.vendor = this.ProcurementDetails.procurement_Request.vendor;
        this.Invoice.procurement_Details.procurement_Request.requisition_Status = this.ProcurementDetails.procurement_Request.requisition_Status;
        this.Invoice.procurement_Details.budget_Line.budget_Allocation = this.ProcurementDetails.budget_Line.budget_Allocation
        this.Invoice.procurement_Details.budget_Line.budget_Category = this.ProcurementDetails.budget_Line.budget_Category
        this.Invoice.procurement_Details.budget_Line.account_Code = this.ProcurementDetails.budget_Line.account_Code
        this.Invoice.procurement_Details.procurement_Request.name = this.ProcurementDetails.procurement_Request.name
        this.Invoice.procurement_Details.procurement_Request.description = this.ProcurementDetails.procurement_Request.description

        this.dataservice.AddInvoice(this.Invoice).subscribe({
          next: (Resp) => {
            this.log.action = "Invoice Uploaded for: " + this.data.name;
            this.log.user = this.dataservice.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataservice.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                this.dialogRef.close();
                this.router.navigate(['/ViewProcurementDetails'])
              }
            })
          }
        })
      })
    }
  }


  Close() {
    this.dialogRef.close()
    this.router.navigate(['/ViewProcurementDetails'])
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}
