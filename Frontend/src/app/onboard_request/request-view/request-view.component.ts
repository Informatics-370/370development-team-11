import { Component,OnInit } from '@angular/core';
import { DataService } from 'src/app/DataService/data-service';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import {VendorOnboardRequest} from 'src/app/Shared/VendorOnboardRequest';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { buffer, elementAt, groupBy } from 'rxjs';
import { VendorOnboardRequestVM } from 'src/app/Shared/VendorOnboardRequestVM';
import { HttpClient } from '@angular/common/http';
//import { ListKeyManager } from '@angular/cdk/a11y';
//import 'rxjs/Rx' ;

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

  OnboardRequest:VendorOnboardRequestVM[] = [];
  vendor:VendorOnboardRequest[] = [];
  RequestVendors:any[] = [];
  
  constructor(private RequestService: DataService,private http: HttpClient) { }

  ngOnInit(): void {
    this.DisplayAllRequests();
    
  }

  DisplayAllRequests() {
    this.RequestService.GetAllOnboardRequest().subscribe(result => {let RequestList:any[] = result
      RequestList.forEach((element) => this.OnboardRequest.push(element));
      RequestList.forEach((element) => this.vendor.push(element.vendors));
 
     this.RequestVendors = this.OnboardRequest.filter((value, index, self) => self.map(x => x.onboard_Request_Id).indexOf(value.onboard_Request_Id) == index)
      })
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
    if (this.RequestVendors.length > 0) {
      iNumber = (this.RequestVendors[(this.RequestVendors.length-1)].onboard_Request_Id+1)
    }
   

    return iNumber
  }

  getFileUrl(sFile : string) {
    
    // const byteCharacters = Buffer.from(sFile);
    // const byteArray = new Uint8Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteArray[i] = byteCharacters.charCodeAt(i);
    // }
    // const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    // const file = new File([blob], 'filename.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

   

  
    //  return file;
    
  
  

  }

  displayedColumns : string[] = ['ID','name','action','delete'];
  dataSource = this.OnboardRequest;
  expandedElement: VendorOnboardRequest | undefined;
}
//, 'Created By' "Http failure response for https://localhost:7186/api/OnboardRequest/GetAllOnboardRequest: 404 OK"