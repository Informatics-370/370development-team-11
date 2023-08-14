import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Access } from 'src/app/Shared/Access';
import { AuditLog } from 'src/app/Shared/AuditLog';
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

  OnboardStatus: Onboard_Status = {
    status_ID: 0,
    name: "",
    description: "",
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

  Onboard_Request: OnboardRequest = {
    onboard_Request_Id: 0,
    user_Id: 1,
    vendor_ID: 0,
    status_ID: 0,
    vendor: { vendor_ID: 0, vendor_Status_ID: 0, vendor_Status: this.VStatus, name: '', email: '', number_Of_Times_Used: 0, sole_Supplier_Provided: false, preferedVendor: false },
    onboard_Status: this.OnboardStatus,
    users: { user_Id: 0, role_ID: 0, access_ID: 0, access: this.Access, username: '', password: '', profile_Picture: './assets/Images/Default_Profile.jpg', no_Notifications: 0, role: this.rl },
    quotes: '',
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<RequestDeleteComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }
  //create api backend 1 for get and one for delete 
  OnboardRequestDetails: any[] = [];
  ngOnInit(): void {

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
        this.dataService.GetUserByUsername(User).subscribe(response => {
          this.Onboard_Request.users = response
          this.Onboard_Request.users.access = response.access
        })

    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetRequestByID(ID).subscribe(result => {
            let requestlist: any[] = result
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
    if (this.OnboardRequestDetails.length > 2) {
      for (let i = 0; i < this.OnboardRequestDetails.length; i++) {
        let VendorID = this.OnboardRequestDetails[i].vendor.vendor_ID
        let sFile = this.OnboardRequestDetails[i].quotes;
        // let sFi = sFile.substring(0,sFile.indexOf("\\"))
        //  sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        // let sOR = sFile.substring(0,sFile.indexOf("\\"))
        // sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        let RequestNo = sFile.substring(0, sFile.indexOf("\\"))
        let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
        this.dataService.DeleteFile(RequestNo, filename).subscribe()
        this.dataService.DeleteRequest(RequestId, VendorID).subscribe({
          next: (response) => {
            if (this.OnboardRequestDetails[0].vendor.vendor_Status_ID == 5 || this.OnboardRequestDetails[0].vendor_Status_ID == 1) {
              this.dataService.DeleteVendor(VendorID).subscribe()
            }
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              if(this.OnboardRequestDetails.length - 1 == i) {
                this.log.action = "Deleted Onboard Request #" + this.OnboardRequestDetails[i].onboard_Request_Id;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    //Action to take after log (Notification etc)
                  }
                })
              }


              this.dialogRef.close();
            }, 1750);
          }
        });
      }
   }
   else {
    let VendorID = this.OnboardRequestDetails[0].vendor.vendor_ID
    if(this.OnboardRequestDetails[0].quotes != "None") {
      let sFile = this.OnboardRequestDetails[0].quotes;
      let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
      console.log(RequestNo)
      let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
      console.log(filename)
      this.dataService.DeleteFile(RequestNo,filename).subscribe()
      this.dataService.DeleteSoleSupplier(VendorID).subscribe(response => {
        this.dataService.DeleteRequest(RequestId,VendorID).subscribe({
          next: (response) => {
            if(this.OnboardRequestDetails[0].vendor.vendor_Status_ID == 5 || this.OnboardRequestDetails[0].vendor_Status_ID == 1) {
              this.dataService.DeleteVendor(VendorID).subscribe()
            }
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.log.action = "Deleted Onboard Request #" + this.OnboardRequestDetails[0].onboard_Request_Id;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  //Action to take after log (Notification etc)
                }
              })

              this.dialogRef.close();
            }, 1750);
          }
        });
      })
      
    }
    else {
      let VendorID = this.OnboardRequestDetails[0].vendor.vendor_ID
      if (this.OnboardRequestDetails[0].quotes != "None") {
        let sFile = this.OnboardRequestDetails[0].quotes;
        let RequestNo = sFile.substring(0, sFile.indexOf("\\"))
        console.log(RequestNo)
        let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
        console.log(filename)
        this.dataService.DeleteFile(RequestNo, filename).subscribe()
        this.dataService.DeleteSoleSupplier(VendorID).subscribe(response => {
          this.dataService.DeleteRequest(RequestId, VendorID).subscribe({
            next: (response) => {
              if (this.OnboardRequestDetails[0].vendor.vendor_Status_ID == 5 || this.OnboardRequestDetails[0].vendor_Status_ID == 1) {
                this.dataService.DeleteVendor(VendorID).subscribe()
              }
              this.showConfirmationDialog = false;
              this.showSuccessDialog = true;
              setTimeout(() => {
                this.dialogRef.close();
              }, 1750);
            }
          });
        })

      }
      else {
        this.dataService.DeleteSoleSupplier(VendorID).subscribe(response => {
          this.dataService.DeleteRequest(RequestId, VendorID).subscribe({
            next: (response) => {
            this.showConfirmationDialog = false;
            this.showSuccessDialog = true;
            setTimeout(() => {
              this.log.action = "Deleted Onboard Request #" + this.OnboardRequestDetails[0].onboard_Request_Id;
              this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
              let test: any
              test = new DatePipe('en-ZA');
              this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
              this.dataService.AuditLogAdd(this.log).subscribe({
                next: (Log) => {
                  //Action to take after log (Notification etc)
                }
              })
              this.dialogRef.close();
            }, 1750);
          }
        });
      })
    }


    }
  } 
  }
  onCancel(): void {
    this.dialogRef.close();
  }

}
