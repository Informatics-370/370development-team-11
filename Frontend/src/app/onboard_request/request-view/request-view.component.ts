import { Component,OnInit, AfterViewInit ,ViewChild } from '@angular/core';
import { DataService } from 'src/app/DataService/data-service';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import {VendorOnboardRequest} from 'src/app/Shared/VendorOnboardRequest';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { Subscription, buffer, elementAt, groupBy } from 'rxjs';
import { VendorOnboardRequestVM } from 'src/app/Shared/VendorOnboardRequestVM';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { RequestDeleteComponent } from '../request-delete/request-delete.component';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequestViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  OnboardRequest:VendorOnboardRequestVM[] = [];
  vendor:VendorOnboardRequest[] = [];
  RequestVendors:any;
  ReqVenLen:any[] = [];
  FileDetails:any[] = [];
  vendorIds:any[] = [];
  
  private refreshSubscription: Subscription;
  constructor(private RequestService: DataService,private http: HttpClient, private route: ActivatedRoute,private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.DisplayAllRequests();
    //this.dataSource = new MatTableDataSource(this.RequestVendors);
   // console.log(this.dataSource)
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
    
  }

  ngOnDestroy() {
    // Unsubscribe from the query parameters subscription to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  DisplayAllRequests() {
    this.RequestService.GetAllOnboardRequest().subscribe(result => {let RequestList:any[] = result
      RequestList.forEach((element) => this.OnboardRequest.push(element));
      RequestList.forEach((element) => this.vendor.push(element.vendors));
      this.RequestVendors =  new MatTableDataSource(this.OnboardRequest.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index));
      this.ReqVenLen = this.OnboardRequest.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index)
      console.log(RequestList)
      
      for(let i = 0; i < RequestList.length; i++) {
        this.FileDetails.push({FileURL:"",FileName:""})
        let sFile = RequestList[i].quotes;
        if(sFile != "None") {
          
          
          let RequestNo = sFile.substring(0,sFile.indexOf("\\"))
          let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
            
            this.FileDetails[i].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
            this.FileDetails[i].FileName = filename; 
         
        
        }
        else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile; 
        }
            
       
      }
      
     
        
      this.vendorIds = [...new Set(this.OnboardRequest.map(req => req.vendor_ID))]
      console.log(this.OnboardRequest)
      console.log(RequestList)
      })
  }

  getVendorByVendorId(vendorId: number) {
    // Filter the vendor array based on the vendor ID
    return this.vendor.filter(ven => ven.vendor_ID === vendorId);
  }

  DisplayFile(sFile : string) {
    if (sFile.length > 15) {
        sFile = sFile.substring(25,sFile.length)
        sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
        return sFile
      
    }
    else {
      let stest = "not a File"
      return stest
    }
    

    
  }


  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.RequestVendors.filter = filterValue.trim().toLowerCase();
  
    if (this.RequestVendors.paginator) {
      this.RequestVendors.paginator.firstPage();
    }
  }

  
  DownloadFile(sFile :string ) {
    if(sFile.length > 20) {
      const formData = new FormData();
    formData.append('sfile',sFile);
    
    this.http.post(`https://localhost:7186/api/OnboardRequest/getFile/`,formData).subscribe(response => 
      {let url:any = response     
        return url.absoluteFolderPath.toString()
      });
      return null
    }
    else {
      let test = ""
      return test
    } 
  }

  

  getTotal() {
    let iNumber = 0
    if (this.ReqVenLen.length > 0) {
      iNumber = (this.ReqVenLen[(this.ReqVenLen.length-1)].onboard_Request_Id+1)
    }
    else {
      iNumber = 1
    }
   

    return iNumber
  }

  DeleteRequest(ID: Number) {
    const confirm = this.dialog.open(RequestDeleteComponent, {
      disableClose: true,
      data: { ID }
    });
  }

  displayedColumns : string[] = ['ID','name','Status','action','delete'];
  //dataSource = this.OnboardRequest;
  expandedElement: VendorOnboardRequest | undefined;
}
