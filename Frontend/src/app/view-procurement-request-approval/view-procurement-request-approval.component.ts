import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { Notification } from 'src/app/Shared/Notification';
import { DatePipe } from '@angular/common';
import { Notification_Type } from '../Shared/Notification_Type';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { Access } from '../Shared/Access';




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-view-procurement-request-approval',
  templateUrl: './view-procurement-request-approval.component.html',
  styleUrls: ['./view-procurement-request-approval.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewProcurementRequestApprovalComponent implements OnInit {


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


  Notification_Type: Notification_Type = {
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


  VendorFormGroup = this._formBuilder.group({
    CompanyName: '',
    CompanyEmail: '',
    Description: '',
  })



  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private _formBuilder: FormBuilder, private http: HttpClient, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  ProcurementRequestID = 0;
  ProcurementRequestDetails: Procurement_Request;
  // file:File[] = [null,null,null]
  FileDetails: any = [];



  ngOnInit() {

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    this.dataService.GetUserByUsername(User).subscribe(response => {
      this.ProcurementRequestDetails.user.access = response.access
      this.ProcurementNotification.user.access = response.access
    })

    for (let i = 0; i < 3; i++) {
      this.FileDetails.push({ FileURL: "", FileName: "" })
    }
    this.route.paramMap.subscribe({
      next: (paramater) => {

        this.ProcurementRequestID = Number(paramater.get("ProcurementRequestID"));

        this.dataService.GetProcurementRequestByID(this.ProcurementRequestID).subscribe(response => {
          this.ProcurementRequestDetails = response;
          if (this.ProcurementRequestDetails.vendor.vendor_Status_ID == 6) {
            this.VendorFormGroup.get("CompanyName")?.setValue(this.ProcurementRequestDetails.vendor.name)
            this.VendorFormGroup.get("CompanyEmail")?.setValue(this.ProcurementRequestDetails.vendor.email)
            this.VendorFormGroup.get("Description")?.setValue(this.ProcurementRequestDetails.description.toString())
            this.dataService.GetProcurementRequestQuoteByID(this.ProcurementRequestID).subscribe(result => {
              let b = 0;
              console.log(result)
              result.forEach(a => {
                this.GetFiles(a.path, b)
                b += 1
                console.log(a.path)
                console.log(b)
              })
            })
          }
          else if (this.ProcurementRequestDetails.vendor.vendor_Status_ID != 6) {
            this.VendorFormGroup.get("CompanyName")?.setValue(this.ProcurementRequestDetails.vendor.name)
            this.VendorFormGroup.get("CompanyEmail")?.setValue(this.ProcurementRequestDetails.vendor.email)
            this.VendorFormGroup.get("Description")?.setValue(this.ProcurementRequestDetails.description.toString())
            this.dataService.GetProcurementRequestQuoteByID(this.ProcurementRequestID).subscribe(result => {
              let b = 0;
              console.log(result);
              result.forEach(a => {
                this.GetFiles(a.path, b)
                b += 1

              })
            })
          }
        })
      }
    })

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  GetFiles(sfilepath: string, i: number) {
    let sFile = sfilepath;
    //console.log(sfilepath)
    let VendorName = sFile.substring(0, sFile.indexOf("\\"))
    sFile = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
    let RequestID = sFile.substring(0, sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
    this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${RequestID}/${filename}`
    this.FileDetails[i].FileName = filename
  }

  AcceptRequest() {
    console.log(this.ProcurementRequestDetails)
    this.dataService.UpdateProcurementRequestStatus(1, this.ProcurementRequestDetails).subscribe({
      next: (response) => {
        console.log(response)
        this.ProcurementNotification.notification_Type_ID = 8;
        let transVar: any
        transVar = new DatePipe('en-ZA');
        this.ProcurementNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
        this.ProcurementNotification.name = response.name + " has been approved";
        this.ProcurementNotification.user_ID = response.user_ID;
        console.log(this.ProcurementNotification)
        this.dataService.ProcurementAddNotification(this.ProcurementNotification).subscribe();

        console.log(response);
        var action = "APPROVE";
        var title = "APPROVE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Request <strong>" + response.name + "</strong> has been <strong style='color:green'> APPROVED </strong> successfully!");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewPendingProcurementRequest']);
          dialogRef.close();
        }, duration);
      }
    })
  }

  RejectRequest() {
    this.dataService.UpdateProcurementRequestStatus(2, this.ProcurementRequestDetails).subscribe({
      next: (response) => {
        this.ProcurementNotification.notification_Type_ID = 9;
        let transVar: any
        transVar = new DatePipe('en-ZA');
        this.ProcurementNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
        this.ProcurementNotification.name = response.name + " has been rejected";
        this.ProcurementNotification.user_ID = response.user_Id;
        this.dataService.ProcurementAddNotification(this.ProcurementNotification).subscribe();

        console.log(response);
        var action = "REJECTED";
        var title = "REJECTION SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Request <strong>" + response.name + "</strong> has been <strong style='color:red'> Rejected </strong> successfully!");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewPendingProcurementRequest']);
          dialogRef.close();
        }, duration);
      }
    })
  }

  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
  }






  openPPROtherTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }
  openPPRNOTOtherTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }

}
