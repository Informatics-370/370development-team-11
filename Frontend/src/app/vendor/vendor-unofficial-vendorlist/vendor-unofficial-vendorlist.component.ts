import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorCreateChoiceComponent } from '../vendor-create-choice/vendor-create-choice.component';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { Subscription, buffer, elementAt, groupBy } from 'rxjs';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { TestScheduler } from 'rxjs/testing';


export interface PendOnboardRequestDetails {
  onboard_Request_Id : number;
  SelectedRequestVendorName: string;
  requestType: string;
  quoteTotal : number;
  employeeName : string;
  vendorId: number;
  VendorStatusId:number;
  onboardRequestStatusID:number;
}

@Component({
  selector: 'app-vendor-unofficial-vendorlist',
  templateUrl: './vendor-unofficial-vendorlist.component.html',
  styleUrls: ['./vendor-unofficial-vendorlist.component.css']
})




export class VendorUnofficialVendorlistComponent implements OnInit{


  constructor(private VendorService: DataService, private dialog: MatDialog, private route: ActivatedRoute,private router: Router,) { }
  private refreshSubscription:Subscription;
  PendingOnboardDetails: OnboardRequest[] = [];
  PendingOnboardRequests: any = [];
  PendingOnboardDetailSummary : PendOnboardRequestDetails[] = [];
  onboardRequestData: any[] = [];
 
  iRole: string;
  rAdmin: string;


  ngOnInit() {
    
    this.PendingOnboardDetails = [];
    this.PendingOnboardRequests = [];
    this.PendingOnboardDetailSummary  = [];
    this.onboardRequestData = [];


    this.iRole = this.VendorService.decodeUserRole(sessionStorage.getItem("token"));

    console.log(this.iRole)

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
    }

   this.VendorService.GetAllOnboardRequest().subscribe((result) => {
      let RequestList:any[] = result
      this.onboardRequestData = result
      RequestList.forEach((element) => this.PendingOnboardDetails.push(element));
      //RequestList.forEach((element) => this.vendor.push(element.vendors));
      this.PendingOnboardRequests =  new MatTableDataSource(this.PendingOnboardDetails.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index));
      console.log(this.PendingOnboardRequests.data)
      console.log(this.PendingOnboardDetails)
      const countsByPart = this.PendingOnboardDetails.reduce((accumulator, currentValue) => {
        const partId = currentValue.onboard_Request_Id;
        
        if (!accumulator.hasOwnProperty(partId)) {
          accumulator[partId] = 0;
        }
        
        accumulator[partId] += 1;
        
        return accumulator;
      }, {});
      
      console.log(countsByPart);
      this.PendingOnboardRequests.data.forEach(element => {
        let sType = "General Suppliers"
        if (countsByPart[element.onboard_Request_Id] == 1) {
          sType = "Sole Supplier"
        }
        let result:PendOnboardRequestDetails = {
          onboard_Request_Id: element.onboard_Request_Id,
          SelectedRequestVendorName: this.getVendorName(element.onboard_Request_Id),
          requestType: sType,
          quoteTotal: countsByPart[element.onboard_Request_Id],
          employeeName:element.employeeName,
          vendorId:element.vendor_ID,
          VendorStatusId:element.vendors.vendor_Status_ID,
          onboardRequestStatusID: element.onboard_Request_status_ID
        }
        console.log(result.SelectedRequestVendorName)
        if(result.SelectedRequestVendorName != "Request Rejected") {
          if(this.rAdmin == "true" && result.VendorStatusId == 4) {
            this.PendingOnboardDetailSummary.push(result)
          }
          else if(result.VendorStatusId != 4) {
            this.PendingOnboardDetailSummary.push(result)
          }
          
        }
        
      })
      this.PendingOnboardRequests = new MatTableDataSource(this.PendingOnboardDetailSummary)
      console.log(this.PendingOnboardRequests)
   })

  }//ngoninIt

  ngOnDestroy() {
    // Unsubscribe from the query parameters subscription to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

 

  applyFilter(event: Event) {

    if (this.PendingOnboardRequests.paginator) {
      this.PendingOnboardRequests.paginator.firstPage();
    }
  }

  Edit(i:number) {
    for (let a = 0; a < this.onboardRequestData.length;a++) {
      if (this.onboardRequestData[a].onboard_Request_Id == i) {
        if(this.onboardRequestData[a].vendors.vendor_Status_ID == 4) {
          this.router.navigate(['/vendor-approve-edit/' + this.onboardRequestData[a].vendor_ID])
        }
      }
    }
    
      
    
  }
  
  getVendorName(i:number) {
    let result = "Request pending"
    for (let a = 0;a < this.onboardRequestData.length;a++) {
        if(this.onboardRequestData[a].onboard_Request_Id == i) {
          if(this.onboardRequestData[a].onboard_Request_status_ID == 3) {
            result = ""
            return this.onboardRequestData[a].vendors.name
          }
          else if(this.onboardRequestData[a].onboard_Request_status_ID == 2 && result != ""){
            result = "Request Rejected"
          }
        }
    }
      return result
  }

  UpdateOnboardRequestStatus(i:number) {

    for (let a = 0;a < this.onboardRequestData.length;a++) {
        if(this.onboardRequestData[a].onboard_Request_Id == i) {
          if(this.onboardRequestData[a].onboard_Request_status_ID == 1) {
            this.VendorService.ChangeOnboardStatus(5,i,this.onboardRequestData[a].vendor_ID).subscribe()
          }
        }
    }
    this.router.navigate(['/vendor-approve/' + i])
  }

  CorrectRouteChoice(i:number) {
  
    for (let a = 0;a < this.onboardRequestData.length;a++) {
      if(this.onboardRequestData[a].onboard_Request_Id == i) {
        if(this.onboardRequestData[a].onboard_Request_status_ID == 4) {
          this.VendorService.ChangeOnboardStatus(5,i,this.onboardRequestData[a].vendor_ID).subscribe()
          this.router.navigate(['/vendor-approve/' + i])
        }
        else if(this.onboardRequestData[a].vendors.vendor_Status_ID == 5 || this.onboardRequestData[a].onboard_Request_status_ID == 3) {
          this.router.navigate(['/vendor-approve/' + i])
        }
      }
  }
  }

  displayedColumns : string[] = ["Id","selected","Type", "TotalQuotes","user","Edit","View"];


}