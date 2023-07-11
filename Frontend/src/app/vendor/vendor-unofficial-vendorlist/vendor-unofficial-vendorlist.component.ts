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


export interface PendOnboardRequestDetails {
  onboard_Request_Id : number;
  requestType: string;
  quoteTotal : number;
  employeeName : string;
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
  ngOnInit(): void {
    
   this.VendorService.GetAllOnboardRequest().subscribe((result) => {
      let RequestList:any[] = result
      RequestList.forEach((element) => this.PendingOnboardDetails.push(element));
      //RequestList.forEach((element) => this.vendor.push(element.vendors));
      this.PendingOnboardRequests =  new MatTableDataSource(this.PendingOnboardDetails.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index));
      console.log(this.PendingOnboardRequests.data)

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
          requestType: sType,
          quoteTotal: countsByPart[element.onboard_Request_Id],
          employeeName:element.employeeName,
        }
        this.PendingOnboardDetailSummary.push(result)
      })
      this.PendingOnboardRequests = new MatTableDataSource(this.PendingOnboardDetailSummary)
      console.log(this.PendingOnboardRequests)
   })
   this.refreshSubscription = this.route.queryParams.subscribe((params: Params) => {
    // Check if the 'refresh' parameter exists and is truthy
    if (params.refresh) {
      // Remove the 'refresh' query parameter
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { refresh: null },
        queryParamsHandling: 'merge'
      }).then(() => {
        // Reload the page after the navigation has completed
        window.location.reload();
      });
    }
  });

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




  displayedColumns : string[] = ["Id","Type", "TotalQuotes","user","View"];


}