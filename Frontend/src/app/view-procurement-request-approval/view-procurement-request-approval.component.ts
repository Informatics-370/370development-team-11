import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-view-procurement-request-approval',
  templateUrl: './view-procurement-request-approval.component.html',
  styleUrls: ['./view-procurement-request-approval.component.css']
})
export class ViewProcurementRequestApprovalComponent implements OnInit{
  
  VendorFormGroup = this._formBuilder.group({
    CompanyName: '',
    CompanyEmail: '',
    Description: '',
  })


  
  constructor(private dataService: DataService, private router: Router,private route: ActivatedRoute,private _formBuilder: FormBuilder, private http: HttpClient,private dialog: MatDialog, private sanitizer:DomSanitizer) { }
  ProcurementRequestID= 0;
  ProcurementRequestDetails: Procurement_Request;
 // file:File[] = [null,null,null]
  FileDetails:any = [];
  ngOnInit() {
    for(let i = 0;i < 3;i++) {
      this.FileDetails.push({FileURL:"",FileName:""})
    }
    this.route.paramMap.subscribe({
      next: (paramater) => {
        
       this.ProcurementRequestID = Number(paramater.get("ProcurementRequestID"));

       this.dataService.GetProcurementRequestByID(this.ProcurementRequestID).subscribe(response => {
        this.ProcurementRequestDetails = response;
        if(this.ProcurementRequestDetails.vendor.vendor_Status_ID == 6) {
          this.VendorFormGroup.get("CompanyName")?.setValue(this.ProcurementRequestDetails.vendor.name)
          this.VendorFormGroup.get("CompanyEmail")?.setValue(this.ProcurementRequestDetails.vendor.email)
          this.VendorFormGroup.get("Description")?.setValue(this.ProcurementRequestDetails.description.toString())
          this.dataService.GetProcurementRequestQuoteByID(this.ProcurementRequestID).subscribe(result => {
            let b = 0;
            console.log(result)
            result.forEach(a => {
              this.GetFiles(a.path,b)
              b += 1
              console.log(a.path)
            })
          })
        }
        else if(this.ProcurementRequestDetails.vendor.vendor_Status_ID != 6) {
          this.VendorFormGroup.get("CompanyName")?.setValue(this.ProcurementRequestDetails.vendor.name)
          this.VendorFormGroup.get("CompanyEmail")?.setValue(this.ProcurementRequestDetails.vendor.email)
          this.VendorFormGroup.get("Description")?.setValue(this.ProcurementRequestDetails.description.toString())
          this.dataService.GetProcurementRequestQuoteByID(this.ProcurementRequestID).subscribe(result => {
            let b = 0;
            console.log(result);
            result.forEach(a => {
              this.GetFiles(a.path,b)
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

  GetFiles(sfilepath:string,i:number) {
    let sFile = sfilepath;
    let VendorName = sFile.substring(0,sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${filename}`
    this.FileDetails[i].FileName = filename
  }

  AcceptRequest() {
    console.log(this.ProcurementRequestDetails)
    this.dataService.UpdateProcurementRequestStatus(1,this.ProcurementRequestDetails).subscribe({
      next: (response) => {
        console.log(response);
        var action = "APPROVE";
        var title = "APPROVE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Request <strong>" + response.name + "</strong> has been <strong style='color:green'> APPROVED </strong> successfully!");

        const dialogRef:MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
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
    this.dataService.UpdateProcurementRequestStatus(2,this.ProcurementRequestDetails).subscribe({
      next: (response) => {
        console.log(response);
        var action = "REJECTED";
        var title = "REJECTION SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Procurement Request <strong>" + response.name + "</strong> has been <strong style='color:red'> Rejected </strong> successfully!");

        const dialogRef:MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
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

  openPDFInNewTab(i:number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
  }

}
