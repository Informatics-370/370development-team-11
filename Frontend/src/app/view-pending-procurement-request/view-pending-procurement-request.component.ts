import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { useAnimation } from '@angular/animations';
@Component({
  selector: 'app-view-pending-procurement-request',
  templateUrl: './view-pending-procurement-request.component.html',
  styleUrls: ['./view-pending-procurement-request.component.css']
})
export class ViewPendingProcurementRequestComponent implements OnInit {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: any;
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanViewFlagPro = this.dataService.decodeCanViewFlagPro(sessionStorage.getItem("token"));
    this.iCanViewPenPro = this.dataService.decodeCanViewPenPro(sessionStorage.getItem("token"));

    // if (this.iRole == "Admin" || this.iRole == "MD") {
    //   this.canViewFlagPro = "true";
    //   this.canViewPenPro = "true";
    // }

    if (this.iCanViewFlagPro == "true") {
      this.canViewFlagPro = "true";
    }

    if (this.iCanViewPenPro == "true") {
      this.canViewPenPro = "true";
    }

    this.GetProcurementRequests();
    console.log(this.ProcurementRequests)
    console.log(this.SearchedPRequests)

    //console.log(User)
  }

  GetProcurementRequests() {

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    //console.log(User)
    this.dataService.GetProcurementRequests().subscribe(result => {
      let procurementRequestList: any[] = result;
      procurementRequestList.forEach(e => {
        // console.log(e.user.username)
        // console.log(User.username)
        if (e.requisition_Status_ID == 3 && User != e.user.username) {
          this.ProcurementRequests.push(e)
          //this.SearchedPRequests.push(e)
        }
      })

      //this.ProcurementRequests = [...procurementRequestList];
      this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
      this.SearchedPRequests.paginator = this.paginator;
      //console.log(this.SearchedPRequests[0].requisition_Status_ID)
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

    if (this.SearchedPRequests.paginator) {
      this.SearchedPRequests.paginator.firstPage();
    }
  }

  // ViewValidation(cName:string) {
  //   var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
  //   if(cName == User.username){
  //     var action = "ERROR";
  //   var title = "USER NOT AN EMPLOYEE";
  //   var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("User must be an <strong style='color:red'> EMPLOYEE </strong>!");

  //   const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
  //     disableClose: true,
  //     data: { action, title, message }
  //   });

  //   const duration = 1750;
  //   setTimeout(() => {
  //     this.router.navigate(['/PlaceProcurementRequest']);
  //     dialogRef.close();
  //   }, duration);
  //   }



  // }



  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange'; // Set the color you want for 'approval required'
      case 'accepted (ready to order)':
        return 'green'; // Set the color you want for 'Approved'
      case 'rejected':
        return 'red'; // Set the color you want for 'Rejected'
      // Add more cases for other status values if needed
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
  }
}
