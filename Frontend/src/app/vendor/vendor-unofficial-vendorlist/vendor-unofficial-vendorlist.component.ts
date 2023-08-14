import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorCreateChoiceComponent } from '../vendor-create-choice/vendor-create-choice.component';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { Subscription, buffer, elementAt, groupBy } from 'rxjs';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { TestScheduler } from 'rxjs/testing';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

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
  styleUrls: ['./vendor-unofficial-vendorlist.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})




export class VendorUnofficialVendorlistComponent implements OnInit{

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private VendorService: DataService, private dialog: MatDialog, private route: ActivatedRoute,private router: Router,) {
   // this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
      };
      this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      // Trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
      }
      });
  }
  private refreshSubscription:Subscription;
  PendingOnboardDetails: OnboardRequest[] = [];
  PendingOnboardRequests: any = [];
  PendingOnboardDetailSummary : PendOnboardRequestDetails[] = [];
  onboardRequestData: any[] = [];
  SearchResults: PendOnboardRequestDetails[] = [];
  iRole: string;
  rAdmin: string;
  sFilter:string;
  mySubscription: any;

  ngOnInit() {
    this.iRole = ""
    this.rAdmin = ""
    if(this.sFilter == undefined) {
      this.sFilter = "1";
    }

    this.iRole = this.VendorService.decodeUserRole(sessionStorage.getItem("token"));

   // console.log(this.iRole)

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

   this.VendorService.GetAllOnboardRequest().subscribe((result) => {
      this.SearchResults = []
      let RequestList:any[] = []
      RequestList = result
      this.onboardRequestData = [];
      this.onboardRequestData = result 
      this.PendingOnboardDetails = [];
      RequestList.forEach((element) => this.PendingOnboardDetails.push(element));
      //RequestList.forEach((element) => this.vendor.push(element.vendors));
      this.PendingOnboardRequests = [];
      this.PendingOnboardRequests =  new MatTableDataSource(this.PendingOnboardDetails.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index));
     // console.log(this.onboardRequestData)
     // console.log(this.PendingOnboardRequests.data)
      //console.log(this.PendingOnboardDetails)
      let countsByPart = undefined
      countsByPart = this.PendingOnboardDetails.reduce((accumulator, currentValue) => {
        const partId = currentValue.onboard_Request_Id;
        
        if (!accumulator.hasOwnProperty(partId)) {
          accumulator[partId] = 0;
        }
        
        accumulator[partId] += 1;
        
        return accumulator;
      }, {});
      
      //console.log(this.onboardRequestData);
      this.PendingOnboardDetailSummary  = [];
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
          VendorStatusId:this.getVendorStatusID(element.onboard_Request_Id),
          onboardRequestStatusID:this.getOnboardStatusID(element.onboard_Request_Id) ,
        }
       // console.log(result)
        if(result.SelectedRequestVendorName != "Request Rejected") {
          if(this.sFilter == "1") {
            if(this.rAdmin == "true" && result.onboardRequestStatusID == 4) {
              this.PendingOnboardDetailSummary.push(result)
              this.SearchResults.push(result)
            }
            else if(result.onboardRequestStatusID != 4) {
              this.PendingOnboardDetailSummary.push(result)
              this.SearchResults.push(result)
            }
          }
          else if(this.sFilter == "2"){
           // console.log(result.VendorStatusId)
            if((result.VendorStatusId == 3 && result.onboardRequestStatusID == 3) || (result.VendorStatusId == 4 && result.onboardRequestStatusID == 3)) {
              this.PendingOnboardDetailSummary.push(result)
              this.SearchResults.push(result)
            }
          }
          else if(this.sFilter == "3") {
           // console.log(result.VendorStatusId)
            if((result.VendorStatusId == 2 && result.onboardRequestStatusID == 2) || (result.VendorStatusId == 1 && result.onboardRequestStatusID == 1) || (result.VendorStatusId == 5 && result.onboardRequestStatusID == 1) || (result.VendorStatusId == 1 && result.onboardRequestStatusID == 2)) {
              this.PendingOnboardDetailSummary.push(result)
              this.SearchResults.push(result)
            }
          }
          else if(this.sFilter == "4") {
            if(this.rAdmin == "true" && result.onboardRequestStatusID == 4 && result.VendorStatusId == 1) {
              this.PendingOnboardDetailSummary.push(result)
              this.SearchResults.push(result)
            }
          }
          
        }
        
        //result.onboardRequestStatusID == 5 || result.onboardRequestStatusID == 3
      })
      if (result) {
        hideloader();
      }

      this.PendingOnboardRequests = new MatTableDataSource(this.PendingOnboardDetailSummary)
      this.PendingOnboardRequests.paginator = this.paginator;

    const Searchterm = this.searchWord.toLocaleLowerCase();
    
    if (Searchterm) {
      this.PendingOnboardRequests.filter = Searchterm.trim().toLowerCase();
      this.PendingOnboardRequests.paginator = this.paginator;
    }
    else if (Searchterm == "") {
      this.PendingOnboardRequests = [...this.SearchResults];
      this.PendingOnboardRequests.paginator = this.paginator;
    }

    if (this.PendingOnboardRequests.paginator) {
      this.PendingOnboardRequests.paginator.firstPage();
    }


      function hideloader() {
        document.getElementById('loading').style.display = "none";
        document.getElementById('table').style.visibility = "visible";
      }
      //console.log(this.PendingOnboardRequests)
   })

  }//ngoninIt

  

  ngOnDestroy() {
    if (this.mySubscription) {
    this.mySubscription.unsubscribe();
    }
  }

  

  ChangeFilter() {
    this.ngOnInit()
    //console.log(this.sFilter)
  }

  searchWord: string = '';

  applyFilter() {
    this.ngOnInit()
    
  }

  Edit(i:number) {
    
    this.VendorService.GetRequestByID(i).subscribe(result => {
     console.log(result)
    for (let a = 0; a < result.length;a++) {
      console.log(i)
      if(result[a].vendor.vendor_Status_ID == 4 || result[a].vendor.vendor_Status_ID == 3) {
        this.router.navigate(['/vendor-approve-edit/' + result[a].vendor_ID])
      }
      
    }
  })
      
    
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

  getVendorStatusID(i:number) {
    let result = 5
    
    for (let a = 0;a < this.onboardRequestData.length;a++) {
        if(this.onboardRequestData[a].onboard_Request_Id == i) {
         // console.log(this.onboardRequestData[a].vendors.vendor_Status_ID)
          if(this.onboardRequestData[a].vendors.vendor_Status_ID == 4 || this.onboardRequestData[a].vendors.vendor_Status_ID == 3) {
            
            result = this.onboardRequestData[a].vendors.vendor_Status_ID
            return result
          }
          else if(this.onboardRequestData[a].vendors.vendor_Status_ID == 2 || this.onboardRequestData[a].vendors.vendor_Status_ID == 1) {
            result = this.onboardRequestData[a].vendors.vendor_Status_ID
            return result
          }
        }
    }
      return result
  }

  
  getOnboardStatusID(i:number) {
    let result = 2
    //console.log(this.onboardRequestData)
    for (let a = 0;a < this.onboardRequestData.length;a++) {
        if(this.onboardRequestData[a].onboard_Request_Id == i) {
         // console.log(this.onboardRequestData[a])
          if(this.onboardRequestData[a].onboard_Request_status_ID == 3) {
            
            result = this.onboardRequestData[a].onboard_Request_status_ID
            return result
          }
          else if(this.onboardRequestData[a].onboard_Request_status_ID == 1) {
            result = this.onboardRequestData[a].onboard_Request_status_ID
            return result
          }
          else if(this.onboardRequestData[a].onboard_Request_status_ID == 4) {
            result = this.onboardRequestData[a].onboard_Request_status_ID
            return result
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
         //this.VendorService.ChangeOnboardStatus(4,i,this.onboardRequestData[a].vendor_ID).subscribe()
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
