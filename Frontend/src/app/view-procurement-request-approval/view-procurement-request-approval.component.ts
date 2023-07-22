import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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


  
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router,private route: ActivatedRoute,private _formBuilder: FormBuilder, private http: HttpClient) { }
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
            result.forEach(a => {
              this.GetFiles(a.path,b)
              b += 1
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
    let FolderCategory = sFile.substring(0,sFile.indexOf("\\"))
    sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    let VendorNo = sFile.substring(0,sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
    this.FileDetails[i].FileURL = `https://localhost:7186/api/Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${filename}`
    this.FileDetails[i].FileName = filename
  }

  AcceptRequest() {
    this.dataService.UpdateProcurementRequestStatus(1,this.ProcurementRequestDetails).subscribe()
  }

  RejectRequest() {
    this.dataService.UpdateProcurementRequestStatus(1,this.ProcurementRequestDetails).subscribe()
  }

  openPDFInNewTab(i:number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
  }

}
