import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VendorDetails } from 'src/app/Shared/VendorDetails';
import { VendorCreateChoiceComponent } from '../vendor-create-choice/vendor-create-choice.component';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { Subscription, buffer, elementAt, groupBy } from 'rxjs';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
  
})
export class VendorViewComponent implements OnInit  {
  
//,'Category'
  constructor(private VendorService: DataService, private dialog: MatDialog, private route: ActivatedRoute,private router: Router,) { }
  private refreshSubscription:Subscription;
  VenDetails: VendorDetails[] = [];
  VendorSearch:any;
  ngOnInit(): void {
    
   this.VendorService.GetAllVendorDetails().subscribe((result) => {
    let VendorDetails:any[] = result 
    VendorDetails.forEach(element => this.VenDetails.push(element))
    this.VendorSearch =  new MatTableDataSource(result)
    console.log(VendorDetails)
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

  CreateApprovedVendor() {
    const confirm = this.dialog.open(VendorCreateChoiceComponent, {
      disableClose: true,
    });
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue) {
      this.VendorSearch = this.VenDetails.filter(r => r.vendor.name.toLocaleLowerCase().includes(filterValue))
    }
    else if (filterValue == "") {
      this.VendorSearch = [...this.VenDetails]
    }


   // this.VendorSearch.filter = filterValue.trim().toLowerCase();
    


    if (this.VendorSearch.paginator) {
      this.VendorSearch.paginator.firstPage();
    }
  }



  displayedColumns : string[] = ["name", "Email","Telephone","View"];
}
