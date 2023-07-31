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

@Component({
  selector: 'app-upload-payement-file',
  templateUrl: './upload-payement-file.component.html',
  styleUrls: ['./upload-payement-file.component.css']
})
export class UploadPayementFileComponent {
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
    account_Code: 0,
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
    account_Code: 0,
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
  pop: Proof_Of_Payment = {
    proof_Of_Payment_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: this.ProcurementDetails,
    proof_Of_Payment_Doc: "string"
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, ID: Number }, private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<UploadPayementFileComponent>) { }

  File = this.data.name
  Data: any[];
  @ViewChild('myTemp')
  myTempRef!: ElementRef;

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      FileAdded: ["", [Validators.required]],
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      setTimeout(() => {

      });
    }

    this.ngOnInit()
  }

  onFileUpload(event: any) {
    console.log('Event:', event); // Log the entire event object
    console.log('Event Target:', event.target); // Log the target element
    console.log('Files:', event.target.files); // Log the FileList object
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null) {
      this.files[0] = this.fileToUpload;
    }
  }

  onSubmit() {
    this.fileToUpload = this.files[0];
    var name = "" + this.data.name
    if (this.fileToUpload != null) {
      let ProofName: string = name

      let file: File = this.fileToUpload

      this.dataservice.POPFileAdd(ProofName, file).subscribe(response => {
        let Path: any = response
        this.sPath = Path.pathSaved.toString()
        this.pop.proof_Of_Payment_Doc = this.sPath;
        this.pop.procurement_Details_ID = 1;
        this.dialogRef.close();
        this.router.navigate(['/ViewProcurementDetails'])
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
