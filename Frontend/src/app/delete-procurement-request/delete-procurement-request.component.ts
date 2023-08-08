import { Component, Inject, OnInit } from '@angular/core';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-procurement-request',
  templateUrl: './delete-procurement-request.component.html',
  styleUrls: ['./delete-procurement-request.component.css']
})
export class DeleteProcurementRequestComponent implements OnInit {
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

  Procurement_Request_Quote: Procurement_Request_Quote = {
    quote_ID: 0,
    procurement_Request_ID: 0,
    procurement_Request: this.Procurement_Request,
    path: "",
    upload_Date: new Date(),
    prefferedQuote: false
  }

  ProcurementQuotes: Procurement_Request_Quote[] = []

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DeleteProcurementRequestComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetPRRequestByID(ID).subscribe(result => {
            this.Procurement_Request = result;
          });

          this.dataService.GetProcurementQuotesbyID(ID).subscribe({
            next: (response) => {
              this.ProcurementQuotes = response;
              console.log(this.ProcurementQuotes)


            }
          })
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeletePRRequest(id).subscribe({
      next: (response) => {
        this.log.action = "Deleted Procurement Request For: " + this.Procurement_Request.name;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe({
          next: (Log) => {
            this.ProcurementQuotes.forEach(element => {

              if (element.procurement_Request_ID == id) {
                let sFile = element.path;
                console.log(element.procurement_Request_ID == id)
                console.log(sFile)
                let VendorName = sFile.substring(0, sFile.indexOf("\\"))
                let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
                let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

                this.dataService.DeleteProcurementRequestFiles(VendorName, RequestID, filename).subscribe({
                  next: (Result) => {
                    this.showConfirmationDialog = false;
                    this.showSuccessDialog = true;
                    setTimeout(() => {
                      this.dialogRef.close();
                      this.route.navigate(['/ViewProcurementRequest']);
                    }, 1750);
                  }
                })
              }
            });
          }
        })

      }

    });

  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
