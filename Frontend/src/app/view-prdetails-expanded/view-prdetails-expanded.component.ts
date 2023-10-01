import { Component, OnInit } from '@angular/core';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { DataService } from '../DataService/data-service';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { HttpClient } from '@angular/common/http';
import { Procurement_Invoice } from '../Shared/Procurement_Invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Payment_Made } from '../Shared/PaymentMade';

@Component({
  selector: 'app-view-prdetails-expanded',
  templateUrl: './view-prdetails-expanded.component.html',
  styleUrls: ['./view-prdetails-expanded.component.css']
})
export class ViewPRDetailsExpandedComponent implements OnInit {

  constructor(private dataService: DataService, private http: HttpClient, private ActRoute: ActivatedRoute, private router: Router) { }
  MasterTable: Procurement_Consumable = {
    procurement_Consumable_ID: 0,
    procurement_Details_ID: 0,
    consumable_ID: 0,
    procurement_Details: null,
    consumable: null,
    quantity: 0

  }
  AssetMasterTable: Procurement_Asset = {
    procurement_Asset_ID: 0,
    procurement_Details_ID: 0,
    asset_ID: 0,
    procurement_Details: null,
    asset: null
  }
  POP: Proof_Of_Payment = {
    proof_Of_Payment_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: null,
    proof_Of_Payment_Doc: ""
  }

  PM: Payment_Made = {
    payment_Made_ID: 0,
    procurement_Details_ID: 0,
    procurement_Details: null,
    paid_On_Date: null,
    receipt_Upload: null
  }

  Invoices: Procurement_Invoice[] = [];

  POPFileDetails: any[] = [];
  INVFileDetails: any[] = [];
  InvoicesPresent: Boolean;
  Type: String;

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (Param) => {
        const id = Number(Param.get("id"));
        const type = Param.get("type")

        if (type == "Consumable") {
          this.dataService.GetProcurementConsumableByID(id).subscribe({
            next: (Response) => {
              this.Type = type;
              this.MasterTable = Response;
              console.log(this.MasterTable)
              this.GetInvoices(id);
              if (this.MasterTable.procurement_Details.payment_Made == true) {
                this.GETPOP(id)

              }
            }
          })
        }

        else if (type == "Assets") {
          this.dataService.GetProcurementAssetByID(id).subscribe({
            next: (Response) => {
              this.Type = type;
              this.AssetMasterTable = Response;
              console.log(this.AssetMasterTable)
              if (this.AssetMasterTable.procurement_Details.payment_Made == true) {
                this.GETPOP(id)
                this.GetInvoices(id);
              }
            }
          })
        }

      }
    })

  }

  openPDFInNewTab(i: number): void {
    const fileURL = this.POPFileDetails[i].FileURL
    window.open(fileURL, '_blank');
    URL.revokeObjectURL(fileURL);
  }

  openINVPDFInNewTab(i: number): void {
    const fileURL = this.INVFileDetails[i].FileURL
    window.open(fileURL, '_blank');
    URL.revokeObjectURL(fileURL);
  }

  GETPOP(id: Number) {
    this.dataService.GetProofOfPaymentByID(id).subscribe({
      next: (doc) => {
        if (doc != null) {
          this.POP = doc;
          let sFile = this.POP.proof_Of_Payment_Doc;
          console.log(sFile)
          this.POPFileDetails.push({ FileURL: "", FileName: "" })

          if (sFile != "None") {
            let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
            let FolderName = Stringtouse.substring(0, (Stringtouse.indexOf("/")))
            console.log(FolderName)
            let Request = Stringtouse.substring(Stringtouse.indexOf("/") + 1, (Stringtouse.lastIndexOf("/")))
            console.log(Request)
            let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
            console.log(filename)

            this.POPFileDetails[0].FileURL = sFile
            this.POPFileDetails[0].FileName = filename
          }
          else {
            this.POPFileDetails[0].FileURL = ""
            this.POPFileDetails[0].FileName = sFile;
          }
        }
        else if (doc == null) {
          this.dataService.GetFullPaymentMadeByID(id).subscribe({
            next: (Response) => {
              this.PM = Response
              let sFile = this.PM.receipt_Upload;
              console.log(sFile)
              this.POPFileDetails.push({ FileURL: "", FileName: "" })

              if (sFile != "None") {
                let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
                let FolderName = Stringtouse.substring(0, (Stringtouse.indexOf("/")))
                console.log(FolderName)
                let Request = Stringtouse.substring(Stringtouse.indexOf("/") + 1, (Stringtouse.lastIndexOf("/")))
                console.log(Request)
                let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
                console.log(filename)

                this.POPFileDetails[0].FileURL = sFile
                this.POPFileDetails[0].FileName = filename
              }
              else {
                this.POPFileDetails[0].FileURL = ""
                this.POPFileDetails[0].FileName = sFile;
              }
            }
          })
        }
      }
    })
  }
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'done':
        return 'green'; // Set the color you want for 'Pending'
      case 'awaiting delivery':
        return 'orange';
      case 'item received and checked':
        return 'blue';
      case 'item received and checked':
        return 'blue';
      case 'asset registered':
        return 'green';// Set the color you want for 'Approved'
      case 'asset to be registered':
        return 'blue';
      case "paid":
        return 'green';
      case "awaiting payment":
        return 'orange';
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }

  GetInvoices(id: Number) {
    this.dataService.GetInvoicesByID(id).subscribe({
      next: (Inv) => {
        this.Invoices = Inv;
        console.log(this.Invoices)
        if (this.Invoices.length == 0) {
          this.InvoicesPresent = false;
        }
        else {
          this.InvoicesPresent = true;

          for (let i = 0; i < this.Invoices.length; i++) {
            this.INVFileDetails.push({ FileURL: "", FileName: "" })
            let sFile = this.Invoices[i].path;
            console.log(sFile)

            if (sFile != "None") {
              let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
              let FolderName = Stringtouse.substring(0, (Stringtouse.indexOf("/")))
              console.log(FolderName)
              let Request = Stringtouse.substring(Stringtouse.indexOf("/") + 1, (Stringtouse.lastIndexOf("/")))
              console.log(Request)
              let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
              console.log(filename)

              this.INVFileDetails[i].FileURL = sFile
              this.INVFileDetails[i].FileName = filename
            }
            else {
              this.INVFileDetails[i].FileURL = ""
              this.INVFileDetails[i].FileName = sFile;
            }
          }
        }
      }
    })
  }

  Close() {
    this.router.navigate(['/ViewProcurementDetails']);
  }



  openViewProcurementDetailsTab(): void {
    const userManualUrl = 'assets/PDF/ViewProcDetailsUM.pdf';
    window.open(userManualUrl, '_blank');
  }
}
