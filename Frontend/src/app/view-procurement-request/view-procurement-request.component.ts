import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DeleteConsumableComponent } from '../delete-consumable/delete-consumable.component';
import { DeleteProcurementRequestComponent } from '../delete-procurement-request/delete-procurement-request.component';

@Component({
  selector: 'app-view-procurement-request',
  templateUrl: './view-procurement-request.component.html',
  styleUrls: ['./view-procurement-request.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewProcurementRequestComponent implements OnInit {

  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: Procurement_Request[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'Status', 'action', 'delete'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private http: HttpClient) { }
  searchWord: string = '';
  ProcurementQuotes: Procurement_Request_Quote[] = [];
  expandedElement: Procurement_Request_Quote | undefined;

  FileDetails: any[] = [];

  getFileDetailsForRequest(procurement_Request_ID: Number) {
    return this.FileDetails.filter(detail => detail.procurement_Request_ID === procurement_Request_ID);
  }


  ngOnInit() {
    this.GetProcurementRequests();
    this.GetPRQuotes()
    console.log(this.ProcurementRequests)

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    console.log(User)
  }

  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
      URL.revokeObjectURL(fileURL);
    });
    // window.open(url, '_blank');
  }

  GetProcurementRequests() {
    this.dataService.GetProcurementRequests().subscribe(result => {
      let procurementRequestList: any[] = result;
      this.ProcurementRequests = [...procurementRequestList];
      this.SearchedPRequests = [...procurementRequestList];
      console.log(this.SearchedPRequests)
      if (result) {
        hideloader();
      }

    });

    function hideloader() {
      document.getElementById('loading').style.display = "none";
      document.getElementById('table').style.visibility = "visible";
    }
  }

  OnInPutChange() {
    const Searchterm = this.searchWord.toLocaleLowerCase();

    if (Searchterm) {
      this.SearchedPRequests = this.ProcurementRequests.filter(PR => PR.name.toLocaleLowerCase().includes(Searchterm))
    }
    else if (Searchterm == "") {
      this.SearchedPRequests = [...this.ProcurementRequests];
    }
  }

  GetPRQuotes() {
    this.dataService.GetProcurementQuotes().subscribe({
      next: (response) => {
        this.ProcurementQuotes = response;
        console.log(response)

        for (let i = 0; i < this.ProcurementQuotes.length; i++) {
          this.FileDetails.push({ FileURL: "", FileName: "" })
          let sFile = this.ProcurementQuotes[i].path;

          if (sFile != "None") {
            let VendorName = sFile.substring(0, sFile.indexOf("\\"))
            let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
            let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${RequestID}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
        }

        console.log(this.ProcurementQuotes)
        console.log(this.FileDetails)

      }
    })
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange'; // Set the color you want for 'Pending'
      case 'accepted':
        return 'green'; // Set the color you want for 'Approved'
      case 'rejected':
        return 'red'; // Set the color you want for 'Rejected'
      // Add more cases for other status values if needed
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }

  DeleteRequest(ID: Number) {
    console.log(ID)
    const confirm = this.Dialog.open(DeleteProcurementRequestComponent, {
      disableClose: true,
      data: { ID }
    });

    this.Dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }


}
