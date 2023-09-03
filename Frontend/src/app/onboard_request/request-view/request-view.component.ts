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
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { OnboardRequestIFrameComponent } from 'src/app/HelpIFrames/OnboardRequestIFrame/onboard-request-iframe/onboard-request-iframe.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}],
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
  
  iCanAppVen: string = "false";
  canAppVen: string;
  iRole: string;

  private refreshSubscription: Subscription;
  constructor(private RequestService: DataService,private http: HttpClient, private route: ActivatedRoute,private router: Router, private dialog: MatDialog) { }

  ngOnInit() {

    this.iRole = this.RequestService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanAppVen = this.RequestService.decodeCanAppVen(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD" || this.iCanAppVen == "true") {
      this.canAppVen = "true";
    }



    this.OnboardRequest = []
    this.vendor = []
    this.FileDetails = []

    this.RequestService.GetAllOnboardRequest().subscribe(result => {let RequestList:any[] = result
      RequestList.forEach((element) => {
        this.OnboardRequest.push(element)
      });
      this.OnboardRequest = result
     for(let i = 0; i < this.OnboardRequest.length; i++) {
       this.FileDetails.push({FileURL:"",FileName:""})
      }

      RequestList.forEach((element) => this.vendor.push(element.vendors));
      this.RequestVendors =  new MatTableDataSource(this.OnboardRequest.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index));
      this.RequestVendors.paginator = this.paginator;
      this.ReqVenLen = this.OnboardRequest.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index)

      let test = [...this.OnboardRequest].sort((a, b) => {
        // First, compare based on onboard_Request_Id in ascending order
        if (a.onboard_Request_Id !== b.onboard_Request_Id) {
          return a.onboard_Request_Id - b.onboard_Request_Id;
        }
      
        // If onboard_Request_Id is the same, then compare based on anotherId in descending order
        return b.vendor_ID - a.vendor_ID;
      });
      
      //let test = this.OnboardRequest.sort((a, b) => a.onboard_Request_Id - b.onboard_Request_Id); let i = 0; i < this.OnboardRequest.length; i++

      

      for(let i = 0; i < this.OnboardRequest.length; i++) {
       // if(this.OnboardRequest)
        let sFile = this.OnboardRequest[i].quotes;

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
      //this.vendorIds = [...new Set(this.OnboardRequest.sort((a,b) => a.vendor_ID - b.vendor_ID).map(req => req.vendor_ID))]
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

  getRequestStatus(i:number) {
    let result = "1"
    for (let a = 0;a < this.OnboardRequest.length;a++) {
        if(this.OnboardRequest[a].onboard_Request_Id == i) {
          if(this.OnboardRequest[a].onboard_Request_status_ID == 3) {
            result = "3"
            return result
          }
          else if(this.OnboardRequest[a].onboard_Request_status_ID == 2 && result != ""){
            result = "2"
          }
          else if(this.OnboardRequest[a].onboard_Request_status_ID == 5) {
            result = "5"
            return result
          }
        }
    }
      return result
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
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }

 


  displayedColumns : string[] = ['ID','name','Status','action','delete'];
  //dataSource = this.OnboardRequest;
  expandedElement: VendorOnboardRequest | undefined;













  openOnboardRequestIFrameTab(): void {
    const dialogRef = this.dialog.open(OnboardRequestIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
