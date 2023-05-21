import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Role } from 'src/app/Shared/EmployeeRole';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { Onboard_Status } from 'src/app/Shared/OnboardStatus';
import { VendorStatus } from 'src/app/Shared/VendorStatus';


@Component({
  selector: 'app-request-delete',
  templateUrl: './request-delete.component.html',
  styleUrls: ['./request-delete.component.css']
})
export class RequestDeleteComponent {

  VStatus: VendorStatus = {
    vendor_Status_ID: 0,
    name: '',
    description: '',
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  OnboardStatus : Onboard_Status = {
    status_ID: 0,
    name: "",
    description: "",
  }

  Onboard_Request: OnboardRequest = {
    onboard_Request_Id: 0,
    user_Id: 1,
    vendor_ID: 0,
    status_ID:0,
    vendor: { vendor_ID: 0, vendor_Status_ID: 0, vendor_Status: this.VStatus, name: '', email: '', number_Of_Times_Used: 0,sole_Supplier_Provided:false },
    onboard_Status: this.OnboardStatus,
    users: { user_Id: 0, role_ID: 0, username: '', password: '', profile_Picture: './assets/Images/Default_Profile.jpg', role: this.rl },
    quotes: '',
  }

  
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<RequestDeleteComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }
//create api backend 1 for get and one for delete 
OnboardRequestDetails: any[] = [];
    ngOnInit(): void {
      this.ActRoute.paramMap.subscribe({
        next: (params) => {
          const ID = this.data.ID;
          console.log(ID);
  
          if (ID) {
            this.dataService.GetRequestByID(ID).subscribe(result => {
              let requestlist:any[] = result
              requestlist.forEach((element) => {
                this.OnboardRequestDetails.push(element)
            });//result
            console.log(this.OnboardRequestDetails.length)
          })//dataservice
        }//if
      }//next
    });//actroute
  console.log(this.OnboardRequestDetails)
 
}//ngonIt

//add loop
  onConfirm(RequestId: number): void {
   // console.log(this.OnboardRequestDetails.length)
    for(let i = 0; i < this.OnboardRequestDetails.length; i++) {
      let VendorID = this.OnboardRequestDetails[i].vendor.vendor_ID
      let sFile = this.OnboardRequestDetails[i].quotes;
            let sFi = sFile.substring(0,sFile.indexOf("\\"))
             sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let sOR = sFile.substring(0,sFile.indexOf("\\"))
            sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        this.dataService.DeleteFile(RequestNo,filename).subscribe!
        this.dataService.DeleteRequest(RequestId,VendorID).subscribe({
          next: (response) => {
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.dialogRef.close();
              location.reload();
            }, 1750);
          }
        });
    }
   
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
