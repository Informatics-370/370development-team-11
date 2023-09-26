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





import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { ProcReqPendingIFrameComponent } from '../HelpIFrames/ProcReqPendingIFrame/proc-req-pending-iframe/proc-req-pending-iframe.component';
import { Employee } from '../Shared/Employee';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-view-pending-procurement-request',
  templateUrl: './view-pending-procurement-request.component.html',
  styleUrls: ['./view-pending-procurement-request.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewPendingProcurementRequestComponent implements OnInit {
  ProcurementRequests: Procurement_Request[] = [];
  SearchedPRequests: any;
  displayedColumns: string[] = ['Name', 'Description', 'User', 'Vendor', 'View'];
  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  searchWord: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  iTempRole: string;
  iTempUsername: string;
  iRole: string;
  iDep: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iTempRole = this.dataService.decodeTempAcc(sessionStorage.getItem("token"));
    this.iDep = this.dataService.decodeUserDep(sessionStorage.getItem("token"));
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
    console.log(this.iRole)
    if (this.iRole == "BO" || this.iTempRole == "BO") {
      this.GetProcurementRequests();
    }

    
   

  }

  GetProcurementRequests() {

    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    
    this.dataService.GetProcurementRequests().subscribe(result => {
      let procurementRequestList: any[] = result;
      procurementRequestList.forEach(e => {
   
        if (e.requisition_Status_ID == 3 && User != e.user.username) {

          if (this.iTempRole == "BO") {
            this.iTempUsername = this.dataService.decodeTempUsername(sessionStorage.getItem("token"));

            this.dataService.GetEmployeeByUsername(this.iTempUsername).subscribe(tempUD => {
              let tempUserDep: any = tempUD;

              this.dataService.GetEmployeeByUsername(e.user.username).subscribe(ud => {

                let userdep: any = ud;

                if (userdep.department.name == tempUserDep.department.name) {
                  this.ProcurementRequests.push(e)
                  this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
                  this.SearchedPRequests.paginator = this.paginator;
                }


              })
            })

            
          } else {
            this.dataService.GetEmployeeByUsername(e.user.username).subscribe(ud => {

              let userdep: any = ud;

              if (userdep.department.name == this.iDep) {
                this.ProcurementRequests.push(e)
                this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
                this.SearchedPRequests.paginator = this.paginator;
              }


            })
          }

          
        }
      })

      //this.ProcurementRequests = [...procurementRequestList];
      //this.SearchedPRequests = new MatTableDataSource(this.ProcurementRequests);
      //this.SearchedPRequests.paginator = this.paginator;
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




  openPPRIFrameTab(): void {
    const dialogRef = this.dialog.open(ProcReqPendingIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
