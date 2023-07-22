import { Component, Inject, OnInit } from '@angular/core';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';

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
    upload_Date: new Date()
  }

  ProcurementQuotes: Procurement_Request_Quote[] = []

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

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
        this.ProcurementQuotes.forEach(element => {

          if (element.procurement_Request_ID == id) {
            let sFile = element.path;
            console.log(element.procurement_Request_ID == id)
            console.log(sFile)
            let VendorName = sFile.substring(0, sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

            this.dataService.DeleteProcurementRequestFiles(VendorName, filename).subscribe({
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

    });

  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
