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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { AuditLog } from '../Shared/AuditLog';
import { Access } from '../Shared/Access';





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-finalize-procurement-request-create',
  templateUrl: './finalize-procurement-request-create.component.html',
  styleUrls: ['./finalize-procurement-request-create.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class FinalizeProcurementRequestCreateComponent {

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
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
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
      no_VenNotifications: 0,
      no_InvNotifications: 0,
      no_DelNotifications: 0,
      no_ProNotifications: 0,
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
  TotalAmountDisplay;
  User: String = "";
  id: number = 0;
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private currencyPipe: CurrencyPipe, private sanitizer: DomSanitizer, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.GetProcurementDetails(this.id);
    this.finalizationForm = this.formBuilder.group({
      mandateLimit: ['', [Validators.required]],
      total: ['', [Validators.required]],
      budgetLine: ['', [Validators.required]],
      ProofOfPayment: false,
      ProofOfPaymentDoc: ["", [Validators.required]],
    })

    this.dataService.GetBudgetLines().subscribe(response => {
      this.BudgetAllocationCode = response;
    })

    this.User = this.dataService.decodeUser(sessionStorage.getItem("token"))

    this.dataService.GetUserByUsername(this.User.toString()).subscribe({
      next: (Response) => {
        this.usr = Response;
      }
    })

    this.finalizationForm.get('total').disable();
    this.finalizationForm.get('budgetLine').disable();
  }

  public onFocus(event: FocusEvent) {
    (event.target as any).blur();
  }

  onSubmit(): void {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    let Selection = this.finalizationForm.get("ProofOfPayment").value;
    if (Selection == true) {
      let ProcurementRequest = `ProcurementDetails${this.id}`
      let ProofName: string = "ProofOfPayment/" + this.ProcurementDetails.procurement_Request.name.toString();
      this.dataService.POPFileAdd(ProofName, this.file[0]).subscribe(response => {

        let Path: any = response.pathSaved.toString()
        this.ProofOfPayment.proof_Of_Payment_Doc = Path;
        this.ProofOfPayment.procurement_Details_ID = Number(this.id);
        this.ProofOfPayment.procurement_Details.procurement_Request.user = this.usr;
        this.ProofOfPayment.procurement_Details.procurement_Request.vendor = this.ProcurementDetails.procurement_Request.vendor;
        this.ProofOfPayment.procurement_Details.procurement_Request.requisition_Status = this.ProcurementDetails.procurement_Request.requisition_Status;
        this.ProofOfPayment.procurement_Details.budget_Line.budget_Allocation = this.ProcurementDetails.budget_Line.budget_Allocation
        this.ProofOfPayment.procurement_Details.budget_Line.budget_Category = this.ProcurementDetails.budget_Line.budget_Category
        this.ProofOfPayment.procurement_Details.budget_Line.budget_Category.account_Code = this.ProcurementDetails.budget_Line.budget_Category.account_Code
        this.ProofOfPayment.procurement_Details.procurement_Request.name = this.ProcurementDetails.procurement_Request.name
        this.ProofOfPayment.procurement_Details.procurement_Request.description = this.ProcurementDetails.procurement_Request.description
        this.dataService.AddProofOfPayment(this.ProofOfPayment).subscribe({
          next: (res) => {
            this.dataService.UpdateProcurementStatus(2, this.id).subscribe({
              next: (Result) => {
                document.getElementById('AnimationBtn').classList.toggle("is_active");
                document.getElementById('cBtn').style.display = "none";
                this.log.action = "Finalised procurement request for: " + this.Procurement_Request.name;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "CREATE";
                    var title = "CREATE SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:green'> FINALISED! </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      dialogRef.close();
                      this.router.navigate(['/ViewBudgetAllocation']);
                    }, duration);
                  }
                })
              }
            })

          }
        });
      })
    }
    else {
      this.dataService.FinalizeProcurementRequest(this.ProcurementDetails.procurement_Details_ID).subscribe(result => {
        this.dataService.UpdateProcurementStatus(2, this.id).subscribe({
          next: (Result) => {
            document.getElementById('AnimationBtn').classList.toggle("is_active");
            document.getElementById('cBtn').style.display = "none";
            this.log.action = "Finalised procurement request for: " + this.Procurement_Request.name;
            this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
            let test: any
            test = new DatePipe('en-ZA');
            this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
            this.dataService.AuditLogAdd(this.log).subscribe({
              next: (Log) => {
                var action = "CREATE";
                var title = "CREATE SUCCESSFUL";
                var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The procurement request for <strong>" + this.Procurement_Request.name + "</strong> has been <strong style='color:green'> FINALISED! </strong> successfully!");

                const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                  disableClose: true,
                  data: { action, title, message }
                });

                const duration = 1750;
                setTimeout(() => {
                  dialogRef.close();
                  this.router.navigate(['/ViewBudgetAllocation']);
                }, duration);
              }
            })
          }
        })
      })
    }


  }
  file: File[] = [null];
  uploadFile(i: number, event: any) {
    this.file[i] = event.target.files[0];
  }
  onCancel(): void {
    this.finalizationForm.reset();
    this.router.navigate(['/FinalizeProcurementRequest']);
  }

  GetProcurementDetails(id: number) {
    this.dataService.GetProcurementDetailsByID(id).subscribe(result => {
      this.ProcurementDetails = result;
      this.ActualAmountDisplay = this.ProcurementDetails.budget_Line.actualAmt;
      this.TotalAmountDisplay = this.ProcurementDetails.total_Amount;
      this.ActualAmountDisplay = this.currencyPipe.transform(this.ActualAmountDisplay, 'R');
      this.TotalAmountDisplay = this.currencyPipe.transform(this.TotalAmountDisplay, 'R');
    })
  }

  public myError = (controlName: string, errorName: string) => {
    return this.finalizationForm.controls[controlName].hasError(errorName);
  }





  openFinalizeProcReqTab(): void {
    const userManualUrl = 'assets/PDF/FinaliseProcurementRequestUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
