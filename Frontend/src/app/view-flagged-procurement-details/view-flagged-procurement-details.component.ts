import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { DatePipe } from '@angular/common';
import { Deposit } from '../Shared/Deposit';
import { Payment_Made } from '../Shared/PaymentMade';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { Notification_Type } from '../Shared/Notification_Type';
import { Notification } from '../Shared/Notification';

@Component({
  selector: 'app-view-flagged-procurement-details',
  templateUrl: './view-flagged-procurement-details.component.html',
  styleUrls: ['./view-flagged-procurement-details.component.css']
})
export class ViewFlaggedProcurementDetailsComponent implements OnInit{

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


  Notification_Type:Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }

  ProcurementNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };




  ProcurementFormGroup = this._formBuilder.group({
    BuyerName: "",
    BuyerEmail: "",
    ItemType: "",
    ConsumableItem:"",
    ConsumableQuantity: 0,
    AssetName:"",
    AssetDescription:"",
    AccountCode:"",
    PaymentType: "",
    HasDeposit:false,
    DepositAmount: 0,
    DepositDueDate: Date.now(),
    FullPaymentMade: false,
    PaidOnDate:Date.now(),
    UploadReceiptDoc: "",
    ProofOfPayment:false,
    ProofOfPaymentDoc: "",
    TotalAmount: 0,
    TotalAmountDueDate:Date.now(),
    Comments:"",
  });


  
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router,private route: ActivatedRoute,private _formBuilder: FormBuilder, private http: HttpClient,private dialog: MatDialog, private sanitizer:DomSanitizer) { }
  ProcurementDetailsID= 0;
  ProcurementDetails: Procurement_Details;
  ConsumableChecked =true;
  AssetChecked=false;
  Deposit:Deposit;
  PaymentMade:Payment_Made;
  ProofOfPayment:Proof_Of_Payment;
  
 // file:File[] = [null,null,null]
  FileDetails:any = [];
  ngOnInit() {
    for(let i = 0;i < 2;i++) {
      this.FileDetails.push({FileURL:"",FileName:""})
    }
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
       this.ProcurementDetailsID = Number(paramater.get("ProcurementDetailsID"));
        
       this.dataService.GetProcurementDetailsByID(this.ProcurementDetailsID).subscribe(response => {
        this.ProcurementDetails = response;
        console.log(this.ProcurementDetails)
        console.log(response)
        let dateChange: any
        dateChange = new DatePipe('en-ZA');
         this.ProcurementFormGroup.get("BuyerName")?.setValue(this.ProcurementDetails.buyer_Name);
         this.ProcurementFormGroup.get("BuyerEmail")?.setValue(this.ProcurementDetails.buyer_Email);
         //consumbleAssets
         this.ProcurementFormGroup.get("ItemType")?.setValue(this.ProcurementDetails.item_Type);
         this.getItemDetails(this.ProcurementDetails.item_Type);
         
         this.ProcurementFormGroup.get("AccountCode")?.setValue(this.ProcurementDetails.budget_Line.budget_Category.account_Name.toString());

         //paymentType
         this.ProcurementFormGroup.get("PaymentType")?.setValue(this.ProcurementDetails.payment_Method.name);
         
         //Deposit
         this.ProcurementFormGroup.get("HasDeposit")?.setValue(this.ProcurementDetails.deposit_Required);
         this.ProcurementFormGroup.get("HasDeposit")?.disable();
         console.log(this.ProcurementDetails.deposit_Required)
         if(this.ProcurementDetails.deposit_Required == true) {
          this.dataService.GetDepositByID(this.ProcurementDetailsID).subscribe(result =>{
            this.Deposit = result
            console.log(this.Deposit)
            this.ProcurementFormGroup.get("DepositAmount")?.setValue(Number(this.Deposit.deposit_Amount));
            this.ProcurementFormGroup.get("DepositDueDate")?.setValue(dateChange.transform(this.Deposit.deposit_Due_Date, 'MM/dd/y'));
          })
         }
         this.ProcurementFormGroup.get("FullPaymentMade")?.setValue(this.ProcurementDetails.payment_Made);
         this.ProcurementFormGroup.get("FullPaymentMade")?.disable();
         if(this.ProcurementDetails.payment_Made == true) {
          this.dataService.GetFullPaymentMadeByID(this.ProcurementDetailsID).subscribe(result => {
            this.PaymentMade = result
            console.log(this.PaymentMade)
            this.ProcurementFormGroup.get("PaidOnDate")?.setValue(dateChange.transform(this.PaymentMade.paid_On_Date, 'MM/dd/y'));
            this.GetFiles(this.PaymentMade.receipt_Upload,0)
          })
         
         
         }
         this.ProcurementFormGroup.get("ProofOfPayment")?.setValue(this.ProcurementDetails.proof_Of_Payment_Required);
         this.ProcurementFormGroup.get("ProofOfPayment")?.disable();
         if(this.ProcurementDetails.proof_Of_Payment_Required == true) {
          this.dataService.GetProofOfPaymentByID(this.ProcurementDetailsID).subscribe(result => {
            this.ProofOfPayment = result;
            console.log(this.ProofOfPayment)
            this.GetFiles(this.ProofOfPayment.proof_Of_Payment_Doc,1)
          })
         }
         
         this.ProcurementFormGroup.get("TotalAmount")?.setValue(Number(this.ProcurementDetails.total_Amount));
         this.ProcurementFormGroup.get("TotalAmountDueDate")?.setValue(dateChange.transform(this.ProcurementDetails.full_Payment_Due_Date, 'MM/dd/y'));
         this.ProcurementFormGroup.get("Comments")?.setValue(this.ProcurementDetails.comment);
       })
      }
    })

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  getItemDetails(sItem:string) {
    console.log(sItem)
    if(sItem == "Consumable") {
      this.ConsumableChecked = true;
      this.AssetChecked = false;
      this.dataService.GetProcurementConsumable().subscribe(a => {
        a.forEach(b => {
          if(b.procurement_Details_ID == this.ProcurementDetailsID) {
            this.ProcurementFormGroup.get("ConsumableItem")?.setValue(b.consumable.name);
            this.ProcurementFormGroup.get("ConsumableQuantity")?.setValue(b.quantity);
          }
        })
      })
      
      this.ProcurementFormGroup.get("AssetName")?.disable();
      this.ProcurementFormGroup.get("AssetDescription")?.disable();
    }
    else {

      this.AssetChecked = true;
      this.ConsumableChecked = false;
      this.dataService.GetProcurementAsset().subscribe(a => {
        a.forEach(b => {
          if(b.procurement_Details_ID == this.ProcurementDetailsID) {
            this.dataService.GetAssetByID(b.asset_ID).subscribe(c => {
              this.ProcurementFormGroup.get("AssetName")?.setValue(c.name);
              this.ProcurementFormGroup.get("AssetDescription")?.setValue(c.description);
            })
            
          }
        })
      })
      this.ProcurementFormGroup.get("ConsumableItem")?.disable();
      this.ProcurementFormGroup.get("ConsumableQuantity")?.disable();
    }
  }

  files: File[] = [null,null];
  fileToUpload: File | null = null;

  GetFiles(sfilepath:string,i:number) {
    let sFile = sfilepath;
    console.log(sFile)
    let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
    sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    let ProcurementID = sFile.substring(0,sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementDetails/GetProcureFiles/${FolderCategory}/${ProcurementID}/${filename}`
    this.FileDetails[i].FileName = filename

    this.dataService.GetProcureFiles(FolderCategory,ProcurementID,filename).subscribe(file => {
      this.fileToUpload = file;
      this.files[i] = this.fileToUpload ;
    })
  }

  AcceptRequest() {
    this.dataService.UpdateProcurementDetailsStatus(1,this.ProcurementDetails).subscribe({
      next: (response) => {
        this.ProcurementNotification.notification_Type_ID = 16;
        let transVar: any
        transVar = new DatePipe('en-ZA');
        this.ProcurementNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
        this.ProcurementNotification.name = this.ProcurementDetails.procurement_Request.name + " has been Approved";
        this.ProcurementNotification.user_ID = this.ProcurementDetails.procurement_Request.user_ID
        this.dataService.ProcurementAddNotification(this.ProcurementNotification).subscribe();
        console.log(response);
        var action = "APPROVE";
        var title = "APPROVE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Details has been <strong style='color:green'> APPROVED </strong> successfully!");

        const dialogRef:MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewFlaggedProcurementRequest']);
          dialogRef.close();
        }, duration);
      }
    })
  }

  RejectRequest() {
    this.dataService.UpdateProcurementDetailsStatus(2,this.ProcurementDetails).subscribe({
      next: (response) => {
        this.dataService.UpdateProcurementRequestStatus(2,this.ProcurementDetails.procurement_Request).subscribe()
        this.ProcurementNotification.notification_Type_ID = 17;
        let transVar: any
        transVar = new DatePipe('en-ZA');
        this.ProcurementNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
        this.ProcurementNotification.name = this.ProcurementDetails.procurement_Request.name + " has been rejected";
        this.ProcurementNotification.user_ID = this.ProcurementDetails.procurement_Request.user_ID;
        this.dataService.ProcurementAddNotification(this.ProcurementNotification).subscribe();
        console.log(response);
        var action = "REJECTED";
        var title = "REJECTION SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Details has been <strong style='color:red'> Rejected </strong> successfully!");

        const dialogRef:MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewFlaggedProcurementRequest']);
          dialogRef.close();
        }, duration);
      }
    })
  }

  openPDFInNewTab(i:number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
  }
}
