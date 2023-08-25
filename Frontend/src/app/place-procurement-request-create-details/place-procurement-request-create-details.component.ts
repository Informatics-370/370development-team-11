import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DataService } from '../DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Vendor_Consumable } from '../Shared/Vendor_Consumable';
import { Asset } from '../Shared/Asset';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Vendor_Asset } from '../Shared/Vendor_Asset';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { Notification } from 'src/app/Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { catchError, map, startWith } from 'rxjs';
import { AuditLog } from '../Shared/AuditLog';
import { Observable } from 'rxjs';
import { NgFor } from '@angular/common';
import { Access } from '../Shared/Access';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
interface AccountCodeDisplay {
  AccountCodeValue: number;
  AccountCodeName: string;
  Year: string;
  Month: string;
}

interface AccountCodeDisplayGroup {
  Year: string;
  Month: string;
  AccountDetails: AccountCodeDisplay[];
}

@Component({
  selector: 'app-place-procurement-request-create-details',
  templateUrl: './place-procurement-request-create-details.component.html',
  styleUrls: ['./place-procurement-request-create-details.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class PlaceProcurementRequestCreateDetailsComponent implements OnInit {

  matcher = new MyErrorStateMatcher()

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
    account_Code: '',
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
    budgetLineId: 0,
    category_ID: 0,
    budget_Allocation: this.budgetAllocation,
    budget_ID: 0,
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

  Vendor_Consumable: Vendor_Consumable = {
    vendor_Consumbale_ID: 0,
    consumable_ID: 0,
    vendor_ID: 0,
    consumable: this.Consumables,
    vendor: this.Procurement_Request.vendor,
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

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }




  constructor(private _formBuilder: FormBuilder, private ProcureService: DataService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ProcurementFormGroup = this._formBuilder.group({
    BuyerName: ["", [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    BuyerEmail: ["", [Validators.required, Validators.maxLength(32), Validators.email]],
    ItemType: ["Consumable"],
    ConsumableItem: ["", [Validators.required]],
    ConsumableQuantity: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    AssetName: ["", [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    AssetDescription: ["", [Validators.required, Validators.maxLength(50)]],
    AccountCode: ["", [Validators.required]],
    PaymentType: [null, [Validators.required]],
    HasDeposit: [false],
    DepositAmount: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    DepositDueDate: [Date.now(), [Validators.required]],
    FullPaymentMade: false,
    PaidOnDate: [Date.now(), [Validators.required]],
    UploadReceiptDoc: ["", [Validators.required]],
    ProofOfPayment: false,
    ProofOfPaymentDoc: ["", [Validators.required]],
    TotalAmount: [null, [Validators.required, Validators.pattern(/^[0-9.]*$/)]],
    TotalAmountDueDate: [Date.now(), [Validators.required]],
    Comments: ["", [Validators.maxLength(50)]],
  });


  ConsumableItems: Consumable[] = [];
  BudgetAllocationCode: any[] = [];
  ConsumableChecked = true;
  AssetChecked = false;
  ProcurementRequest_ID = 0;
  MandateLimitAmount: 0;
  currentYear = new Date().getFullYear();
  currentmonth = new Date().getMonth();
  currentDay = new Date().getDate();
  currentDate: any;
  sAssets: Asset[] = []
  assetnames: string[] = [];
  filteredAssets: Observable<string[]>;

  AccountCodeDetails: AccountCodeDisplay[] = [];
  AccountCodeGroups: AccountCodeDisplayGroup[] = [];
  ngOnInit() {
    var User = this.ProcureService.decodeUser(sessionStorage.getItem('token'))
    this.ProcureService.GetUserByUsername(User).subscribe(response => {
      this.EmployeeDetails.user.access = response.access
      this.VendorNotification.user.access = response.access
    })

    this.ProcureService.getAssets().subscribe(r => {
      console.log(r)
      this.sAssets = r
      console.log(this.sAssets)
      this.sAssets.forEach(x => this.assetnames.push(x.name));
      //this.assetnames.push(r.name);
      console.log(this.sAssets)
      this.filteredAssets = this.ProcurementFormGroup.get("AssetName")?.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
      console.log(this.filteredAssets)
    })



    this.currentDate = new Date(this.currentYear, this.currentmonth, this.currentDay);
    this.ProcurementFormGroup.get("AssetName")?.disable();
    this.ProcurementFormGroup.get("AssetDescription")?.disable();
    this.ProcurementFormGroup.get("DepositAmount")?.disable();
    this.ProcurementFormGroup.get("DepositDueDate")?.disable()
    this.ProcurementFormGroup.get("PaidOnDate")?.disable();
    this.ProcurementFormGroup.get("UploadReceiptDoc")?.disable();
    this.ProcurementFormGroup.get("ProofOfPaymentDoc")?.disable();

    var User = this.ProcureService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
    this.route.paramMap.subscribe({
      next: (paramater) => {

        this.ProcurementRequest_ID = Number(paramater.get("ProcurementRequestID"));
        this.ProcureService.GetConsumables().subscribe(response => {
          this.ConsumableItems = response
          console.log(this.ConsumableItems)
        })
        //User
        this.ProcureService.GetEmployeeByUsername(User).subscribe(result => {
          console.log(result)
          let employeeInfo: any = result;
          this.EmployeeDetails = employeeInfo;
          this.MandateLimitAmount = employeeInfo.mandate_Limit.ammount
          this.ProcurementDetails.employee.user.access = employeeInfo.user.access;
          this.ProcurementFormGroup.get("BuyerName")?.setValue(this.EmployeeDetails.employeeName.toString())
          this.ProcurementFormGroup.get("BuyerEmail")?.setValue(this.EmployeeDetails.email.toString())
          let departmentname = this.EmployeeDetails.department.name
          this.ProcureService.GetProcurementAccountCodeDetails(this.currentYear, this.currentmonth, departmentname.toString()).subscribe(response => {
            console.log(response)
            this.BudgetAllocationCode = response;
            this.BudgetAllocationCode.forEach(t => {
              let AccountInfo: AccountCodeDisplay = {
                AccountCodeValue: t.budgetLineId,
                AccountCodeName: t.budget_Category.account_Name.toString(),
                Year: t.budget_Allocation.year.toString(),
                Month: t.month.toString(),
              };
              console.log(AccountInfo)
              this.AccountCodeDetails.push(AccountInfo);
            })

            this.AccountCodeDetails.forEach(b => {
              //console.log()
              if (this.AccountCodeGroups.filter(x => (x.Month == b.Month) && (x.Year == b.Year)).length == 0) {
                if (this.AccountCodeGroups.filter(x => (x.Month == b.Month) && (x.Year == b.Year))) {
                  let AccountGroupInfo: AccountCodeDisplayGroup = {
                    Year: b.Year,
                    Month: b.Month,
                    AccountDetails: this.AccountCodeDetails.filter(x => (x.Month == b.Month) && (x.Year == b.Year)),
                  };
                  this.AccountCodeGroups.push(AccountGroupInfo)
                }
              }
            })

            console.log(this.AccountCodeGroups)

          })
        },
          (error) => {
            var action = "ERROR";
            var title = "USER NOT AN EMPLOYEE";
            var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("User must be an <strong style='color:red'> EMPLOYEE </strong>!");

            const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
              disableClose: true,
              data: { action, title, message }
            });

            const duration = 1750;
            setTimeout(() => {
              this.router.navigate(['/PlaceProcurementRequest']);
              dialogRef.close();
            }, duration);
          }
        )
        this.ProcureService.GetProcurementRequestByID(this.ProcurementRequest_ID).subscribe(result => {
          console.log(result)
          this.Procurement_Request = result
          console.log(this.Procurement_Request)
        })
      }
    })
  }

  ChangeDescription(sName: string) {
    let Description = this.sAssets.find(x => x.name == sName).description
    this.ProcurementFormGroup.get("AssetDescription")?.setValue(Description)
  }

  _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.assetnames.filter(asset => this._normalizeValue(asset).toLowerCase().indexOf(filterValue) === 0);
  }


  ConsumableCheckChange() {
    if (this.ProcurementFormGroup.get("ItemType")?.value == "Consumable") {
      this.ProcurementFormGroup.get("ConsumableItem")?.enable();
      this.ProcurementFormGroup.get("ConsumableQuantity")?.enable();
      this.ConsumableChecked = true;
      this.AssetChecked = false;
      this.ProcurementFormGroup.get("AssetName")?.disable();
      this.ProcurementFormGroup.get("AssetDescription")?.disable();

    }
    else {
      this.ProcurementFormGroup.get("AssetName")?.enable();
      this.ProcurementFormGroup.get("AssetDescription")?.enable();
      this.AssetChecked = true;
      this.ConsumableChecked = false;
      this.ProcurementFormGroup.get("ConsumableItem")?.disable();
      this.ProcurementFormGroup.get("ConsumableQuantity")?.disable();
    }
  }

  DepositChange() {
    if (this.ProcurementFormGroup.get("HasDeposit")?.value == true) {
      this.ProcurementFormGroup.get("DepositAmount")?.enable();
      this.ProcurementFormGroup.get("DepositDueDate")?.enable();
    }
    else {
      this.ProcurementFormGroup.get("DepositAmount")?.disable();
      this.ProcurementFormGroup.get("DepositDueDate")?.disable();
    }
  }

  ProofOfPaymentChange() {
    if (this.ProcurementFormGroup.get("ProofOfPayment")?.value == true) {
      this.ProcurementFormGroup.get("ProofOfPaymentDoc")?.enable();
    }
    else {
      this.ProcurementFormGroup.get("ProofOfPaymentDoc")?.disable();
    }
  }

  PaymentMadeChange() {
    if (this.ProcurementFormGroup.get("FullPaymentMade")?.value == true) {
      this.ProcurementFormGroup.get("PaidOnDate")?.enable();
      this.ProcurementFormGroup.get("UploadReceiptDoc")?.enable();
    }
    else {
      this.ProcurementFormGroup.get("PaidOnDate")?.disable();
      this.ProcurementFormGroup.get("UploadReceiptDoc")?.disable();
    }
  }
  file: File[] = [null, null];
  uploadFile(i: number, event: any) {
    this.file[i] = event.target.files[0];
    console.log(this.file[i])
  }

  Validation() {
    if (this.ConsumableChecked == true) {
      let maxValue = this.ConsumableItems.filter(y => y.consumable_ID == Number(this.ProcurementFormGroup.get("ConsumableItem").value))
      let value = Number(maxValue[0].maximum_Reorder_Quantity) - Number(maxValue[0].minimum_Reorder_Quantity)
      if (Number(this.ProcurementFormGroup.get("ConsumableQuantity").value) <= value) {
        this.Create();
      }
      else {
        var action = "ERROR";
        var title = "CONSUMABLE QUANTITY EXCEEDED";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Consumable Quantity has exceeded max limit of <strong style='color:red'>" + value + "</strong>!");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
        }, duration);
      }



      console.log(Number(maxValue[0].maximum_Reorder_Quantity))
      this.ProcurementFormGroup.get("ConsumableItem").setValidators(Validators.max(Number(maxValue[0].maximum_Reorder_Quantity)))
    }
    else if (this.AssetChecked == true) {
      this.Create()
    }
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
    if (this.ProcurementDetails.payment_Made == true) {
      this.ProcurementDetails.procurement_Payment_Status_ID = 1;
    }
    else {
      this.ProcurementDetails.procurement_Payment_Status_ID = 2;
    }
    if (this.MandateLimitAmount < Number(this.ProcurementDetails.total_Amount)) {
      this.ProcurementDetails.procurement_Status_ID = 3;
      this.VendorNotification.notification_Type_ID = 14;
      let transVar: any
      transVar = new DatePipe('en-ZA');
      this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
      this.VendorNotification.name = this.Procurement_Request.name + " has been flagged for exceeded mandate limit";
      this.VendorNotification.user_ID = 1;
      this.ProcureService.ProcurementAddNotification(this.VendorNotification).subscribe();
    }
    else {
      this.ProcurementDetails.procurement_Status_ID = 1;
    }


    this.ProcurementDetails.BudgetLineId = Number(this.ProcurementFormGroup.get("AccountCode")?.value);
    this.ProcurementDetails.budget_Line.budget_Category.account_Code = this.ProcurementFormGroup.get("AccountCode")?.value;
    this.ProcurementDetails.payment_Method_ID = this.ProcurementFormGroup.get("PaymentType")?.value;
    this.ProcurementDetails.procurement_Request = this.Procurement_Request;
    this.ProcurementDetails.procurement_Request_ID = Number(this.Procurement_Request.procurement_Request_ID);
    console.log(this.ProcurementDetails)
    this.ProcureService.AddProcurementDetails(this.ProcurementDetails).subscribe(result => {
      console.log(result[0])
      if (result[0].procurement_Status_ID != 3) {
        this.ProcureService.UpdateBudgetLineAmount(this.ProcurementDetails.total_Amount, result[0].budget_Line).subscribe();
      }
      if (this.ProcurementDetails.deposit_Required == true) {
        this.Deposit.deposit_Amount = this.ProcurementFormGroup.get("DepositAmount")?.value;
        this.Deposit.amount_Outstanding = (Number(this.ProcurementFormGroup.get("TotalAmount")?.value) - Number(this.ProcurementFormGroup.get("DepositAmount")?.value))
        this.Deposit.procurement_Details = result[0];
        this.Deposit.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
        this.Deposit.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
        this.Deposit.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
        this.Deposit.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
        this.Deposit.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
        this.Deposit.deposit_Due_Date = dateChange.transform(this.ProcurementFormGroup.get("DepositDueDate")?.value, 'MM, dd, y');
        this.Deposit.procurement_Details_ID = result[0].procurement_Details_ID;
        //console.log(this.Deposit)
        this.ProcureService.AddDeposit(this.Deposit).subscribe(check => { console.log(check) })
      }
      if (this.ProcurementDetails.proof_Of_Payment_Required == true) {
        let FolderCategory = "ProofOfPayment"
        let ProcurementRequest = `ProcurementDetail${result[0].procurement_Details_ID}`
        console.log(ProcurementRequest)
        this.ProcureService.uploadProcureFile(FolderCategory, ProcurementRequest, this.file[1]).subscribe(response => {
          this.ProofOfPayment.procurement_Details = result[0];
          this.ProofOfPayment.procurement_Details_ID = result[0].procurement_Details_ID;
          let Path: any = response
          this.ProofOfPayment.proof_Of_Payment_Doc = Path.returnedPath.toString()
          this.ProofOfPayment.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
          this.ProofOfPayment.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
          this.ProofOfPayment.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
          this.ProofOfPayment.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
          this.ProofOfPayment.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category;
          this.ProcureService.AddProofOfPayment(this.ProofOfPayment).subscribe();
        })
      }
      if (this.ProcurementDetails.payment_Made == true) {
        let FolderCategory = "PaymentMade";
        let ProcurementRequest = `ProcurementDetail${result[0].procurement_Details_ID}`;

        this.ProcureService.uploadProcureFile(FolderCategory, ProcurementRequest, this.file[0]).subscribe(response => {
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
      if (this.ProcurementFormGroup.get("ItemType")?.value == "Consumable") {
        this.Procurement_Consumable.consumable_ID = Number(this.ProcurementFormGroup.get("ConsumableItem")?.value)
        this.Procurement_Consumable.procurement_Details_ID = result[0].procurement_Details_ID;
        this.Procurement_Consumable.procurement_Details = result[0]
        this.Procurement_Consumable.procurement_Details.procurement_Request.user = this.Procurement_Request.user;
        this.Procurement_Consumable.procurement_Details.procurement_Request.vendor = this.Procurement_Request.vendor;
        this.Procurement_Consumable.procurement_Details.procurement_Request.requisition_Status = this.Procurement_Request.requisition_Status;
        this.Procurement_Consumable.procurement_Details.budget_Line.budget_Allocation = this.BudgetAllocationCode[0].budget_Allocation
        this.Procurement_Consumable.procurement_Details.budget_Line.budget_Category = this.BudgetAllocationCode[0].budget_Category
        this.Procurement_Consumable.procurement_Details.employee.user.access = this.ProcurementDetails.employee.user.access
        this.Procurement_Consumable.quantity = Number(this.ProcurementFormGroup.get("ConsumableQuantity")?.value)
        this.ConsumableItems.forEach(e => {
          if (e.consumable_Category_ID == Number(this.ProcurementFormGroup.get("ConsumableItem")?.value)) {
            this.Procurement_Consumable.consumable = e
          }
        })
        console.log(this.Procurement_Consumable)
        this.ProcureService.AddProcurementConsumable(this.Procurement_Consumable).subscribe(r => { console.log(r) })
        this.ProcureService.GetVendorConsumable().subscribe(b => {
          this.Vendor_Consumable.consumable_ID = Number(this.ProcurementFormGroup.get("ConsumableItem")?.value)
          console.log(b.length + 1)
          this.ConsumableItems.forEach(e => {
            if (e.consumable_Category_ID == Number(this.ProcurementFormGroup.get("ConsumableItem")?.value)) {
              console.log(e)
              this.Vendor_Consumable.consumable = e
              this.Vendor_Consumable.vendor = this.Procurement_Request.vendor;
              this.Vendor_Consumable.vendor_ID = Number(this.Procurement_Request.vendor_ID);
              this.Vendor_Consumable.vendor_Consumbale_ID = 0
              console.log(this.Vendor_Consumable)
              //(b.length + 1);
              this.ProcureService.AddVendorConsumable(this.Vendor_Consumable).subscribe(r => { console.log(r) });
            }
          })
        })

      }
      else {
        this.assets.description = this.ProcurementFormGroup.get("AssetDescription")?.value;
        this.assets.name = this.ProcurementFormGroup.get("AssetName")?.value;
        this.ProcureService.AddAsset(this.assets).subscribe(data => {
          console.log(data)
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
          console.log(this.procurment_assets)
          this.ProcureService.AddProcurementAsset(this.procurment_assets).subscribe(r => console.log(r));

          this.ProcureService.GetVendorAsset().subscribe(a => {
            this.vendor_asset.asset = data[0]
            this.vendor_asset.asset_ID = data[0].asset_ID;
            this.vendor_asset.vendor = this.Procurement_Request.vendor;
            this.vendor_asset.vendor_ID = Number(this.Procurement_Request.vendor_ID);
            this.vendor_asset.asset_ID = (a.length + 1);
            this.ProcureService.AddVendorAsset(this.vendor_asset).subscribe(r => console.log(r))
          })

        })
      }
      document.getElementById('AnimationBtn').classList.toggle("is_active");
      document.getElementById('cBtn').style.display = "none";
      this.log.action = "Placed Procurement Request for: " + this.ProcurementDetails.procurement_Request.name;
      this.log.user = this.ProcureService.decodeUser(sessionStorage.getItem("token"));
      let test: any
      test = new DatePipe('en-ZA');
      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
      this.ProcureService.AuditLogAdd(this.log).subscribe({
        next: (Log) => {
          var action = "PLACED";
          var title = "PLACED PROCUREMENT REQUEST";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement details for procurement <strong>" + result[0].procurement_Request.name + "</strong> has been <strong style='color:green'> PLACED </strong> successfully!");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            this.router.navigate(['/PlaceProcurementRequest']);
            dialogRef.close();
          }, duration);
        }
      })



    })
  }






  openPPRDTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf';
    window.open(userManualUrl, '_blank');
  }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
