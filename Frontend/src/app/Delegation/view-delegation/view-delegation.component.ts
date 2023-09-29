import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEmployeeComponent } from '../../delete-employee/delete-employee.component';
import { Employee } from '../../Shared/Employee';
import { Role } from '../../Shared/EmployeeRole';
import { User } from '../../Shared/User';
import { DataService } from '../../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../../notificationdisplay/notificationdisplay.component';
import { OnboardRequest } from '../../Shared/OnboardRequest';
import { Delegation_Of_Authority } from '../../Shared/DelegationOfAuthority';
import { DelegationStatus } from '../../Shared/DelegationStatus';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { DeleteDelegationComponent } from '../delete-delegation/delete-delegation.component';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { RejectDelegationComponent } from '../reject-delegation/reject-delegation.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from 'src/app/Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from 'src/app/Settings/restore-dialog/restore-dialog.component';
import { DelegationIFrameComponent } from 'src/app/HelpIFrames/DelegationIFrame/delegation-iframe/delegation-iframe.component';
import { TimerComponent } from 'src/app/Settings/timer/timer.component';
import { CreateVatComponent } from '../../Settings/create-vat/create-vat.component';
import { EditVatComponent } from '../../Settings/edit-vat/edit-vat.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-view-delegation',
  templateUrl: './view-delegation.component.html',
  styleUrls: ['./view-delegation.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ViewDelegationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumnsAdmin: string[] = ['delegatingParty', 'Delegate', 'sDate', 'eDate', 'doaForm', 'status', 'action', 'delete', 'revoke'];
  dataSource: any;

  userDelete: any
  rl: Role = {
    role_ID: 0,
    name: '',
    description: '',
  }

  RoleToUse: string = "";

  iRole: string;
  rAdmin: string;
  rMD: string;

  FileDetails: any[] = [];

  SearchFileDetails: any[] = [];
  


  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer, private http: HttpClient, private datePipe: DatePipe) { }

  DeleteDelegationss: Delegation_Of_Authority[] = [];
  Delegations: Delegation_Of_Authority[] = [];
  SearchedDelegation: Delegation_Of_Authority[] = [];
  Users: User[] = [];
  /*OnboardRequests: OnboardRequest[] = [];*/
  searchWord: string = "";

  ngOnInit() {

    this.dataService.CheckDelegation().subscribe({
      next: (r) => {
        if (r) {
          this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

          if (this.iRole == "Admin" || this.iRole == "MD") {
            this.rAdmin = "true";
          }

          this.RoleToUse = this.dataService.decodeUserRole(sessionStorage.getItem("token"))

          this.GetDelegations();
        }
      }
    })




  }

  searchedDelegations: any;

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();

    if (this.iRole == "Admin" || this.iRole == "MD") {
      if (searchTerm) {
        this.dataSource = new MatTableDataSource(this.Delegations.filter(r => r.delegatingParty.toLocaleLowerCase().includes(searchTerm)))

        this.SearchedDelegation = this.Delegations.filter(r => r.delegatingParty.toLocaleLowerCase().includes(searchTerm));

        for (let n = 0; n < this.SearchedDelegation.length; n++) {
          let id = this.SearchedDelegation[n].delegation_ID;

          this.FileDetails[n] = this.SearchFileDetails[Number(id) - 1];
        }
      }
      else if (searchTerm == "") {
        this.FileDetails.length = 0;
        this.SearchFileDetails.length = 0;
        this.GetDelegations();
      }
    }


  }


  GetDelegations() {

    if (this.iRole == "Admin" || this.iRole == "MD") {

      this.dataService.GetDelegations().subscribe(result => {
        let employeeList: any[] = result;
        this.Delegations = [...employeeList];
        this.SearchedDelegation = [...employeeList];
        this.dataSource = new MatTableDataSource(this.Delegations.filter((value, index, self) => self.map(x => x.delegation_ID).indexOf(value.delegation_ID) == index));
        this.dataSource.paginator = this.paginator

        if (result) {
          hideloader();
        }

        for (let i = 0; i < this.Delegations.length; i++) {
          this.FileDetails.push({FileID: 0, FileURL: "", FileName: "" })
          let sFile = this.Delegations[i].delegation_Document;

          if (sFile != "None") {
            let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileID = i + 1;
            this.FileDetails[i].FileURL = `https://localhost:7186/api/Delegation/GetDelegationFiles/${DelegateName}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileID = 0;
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
        }

        for (let f = 0; f < this.FileDetails.length; f++) {
          this.SearchFileDetails[f] = this.FileDetails[f];
        }
        /*this.SearchedEmployee = this.Employees;*/
      })
    }


    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
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

  DeleteDelegation(ID: Number) {
    const confirm = this.dialog.open(DeleteDelegationComponent, {
      disableClose: true,
      data: { ID }
    });

    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }

  RevokeAccess(ID: number) {
    const select = this.dialog.open(RejectDelegationComponent, {
      disableClose: true,
      data: { ID }
    })

    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }




  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openRestoreDialog() {
    const dialogRef = this.dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openTimerDialog() {
    const dialogRef = this.dialog.open(TimerComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreateVATDialog() {
    const dialogRef = this.dialog.open(CreateVatComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditVATDialog() {
    const dialogRef = this.dialog.open(EditVatComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDelegationIFrameTab(): void {
    const dialogRef = this.dialog.open(DelegationIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
}
