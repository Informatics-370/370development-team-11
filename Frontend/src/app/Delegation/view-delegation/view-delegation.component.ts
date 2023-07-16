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


@Component({
  selector: 'app-view-delegation',
  templateUrl: './view-delegation.component.html',
  styleUrls: ['./view-delegation.component.css'],

})
export class ViewDelegationComponent implements OnInit{

  
  displayedColumnsAdmin: string[] = ['id', 'delegatingParty', 'Delegate', 'sDate', 'eDate', 'doaForm', 'status', 'action', 'delete'];
  displayedColumnsMD: string[] = ['id', 'delegatingParty', 'Delegate', 'sDate', 'eDate', 'doaForm', 'status', 'accept', 'reject'];
  dataSource = new MatTableDataSource<Delegation_Of_Authority>;
  dataSourceMD = new MatTableDataSource<Delegation_Of_Authority>;

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
  


  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private sanitizer: DomSanitizer, private http: HttpClient, private datePipe: DatePipe) { }

  DeleteDelegationss: Delegation_Of_Authority[] = [];
  Delegations: Delegation_Of_Authority[] = [];
  SearchedDelegation: Delegation_Of_Authority[] = [];
  Users: User[] = [];
  /*OnboardRequests: OnboardRequest[] = [];*/
  searchWord: string = "";

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" ) {
      this.rAdmin = "true";
    } else if (this.iRole == "MD") {
      this.rMD = "true";
    }

    this.RoleToUse = this.dataService.decodeUserRole(sessionStorage.getItem("token"))
    //console.log(this.RoleToUse)
    //console.log(this.RoleToUse === "Admin")

    this.GetDelegations();
  }

  

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
    
    if (this.iRole == "Admin") {
      if (searchTerm) {
        this.dataSource = new MatTableDataSource(this.Delegations.filter(r => r.delegatingParty.toLocaleLowerCase().includes(searchTerm)))
      }
      else if (searchTerm == "") {
        this.dataSource = new MatTableDataSource([...this.Delegations])
      }
    } else if (this.iRole == "MD") {
      if (searchTerm) {
        this.dataSourceMD = new MatTableDataSource(this.Delegations.filter(r => r.delegatingParty.toLocaleLowerCase().includes(searchTerm)))
      }
      else if (searchTerm == "") {
        this.dataSourceMD = new MatTableDataSource([...this.Delegations])
      }
    }

    
  }

  GetDelegations() {

    if (this.iRole == "Admin") {

      this.dataService.GetDelegations().subscribe(result => {
        if (result) {
          hideloader();
        }

        this.Delegations = result;
        this.dataSource = new MatTableDataSource(result);

        for (let i = 0; i < this.Delegations.length; i++) {
          this.FileDetails.push({ FileURL: "", FileName: "" })
          let sFile = this.Delegations[i].delegation_Document;

          if (sFile != "None") {
            let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileURL = `https://localhost:7186/api/Delegation/GetDelegationFiles/${DelegateName}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
        }
        /*this.SearchedEmployee = this.Employees;*/
      })
    } else if (this.iRole == "MD") {
      this.dataService.GetDelegationsByRole().subscribe(result => {
        if (result) {
          hideloader();
        }

        this.Delegations = result;
        this.dataSourceMD = new MatTableDataSource(result);

        for (let i = 0; i < this.Delegations.length; i++) {
          this.FileDetails.push({ FileURL: "", FileName: "" })
          let sFile = this.Delegations[i].delegation_Document;

          if (sFile != "None") {
            let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
            let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileURL = `https://localhost:7186/api/Delegation/GetDelegationFiles/${DelegateName}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  

  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
    // window.open(url, '_blank');
  }

  DeleteDelegation(ID: Number) {
    const confirm = this.dialog.open(DeleteDelegationComponent, {
      disableClose: true,
      data: { ID }
    });
  }

  acceptRequest(id: number) {
    this.dataService.EditDelegationStatus(2, id).subscribe(r => {
      var action = "ACCEPT";
      var title = "ACCEPT SUCCESSFUL";
      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + id + "</strong> has been <strong style='color:green'> ACCEPTED </strong> successfully!");

      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
        disableClose: true,
        data: { action, title, message }
      });

      const duration = 1750;
      setTimeout(() => {
        this.router.navigate(['/Delegation'], { queryParams: { refresh: true } });
        dialogRef.close();
      }, duration);
    })
  }

  rejectRequest(ID: number) {
    const select = this.dialog.open(RejectDelegationComponent, {
      disableClose: true,
      data: { ID }
    })

    //this.dataService.EditDelegationStatus(2, id).subscribe(r => {
    //  var action = "ACCEPT";
    //  var title = "ACCEPT SUCCESSFUL";
    //  var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Request No <strong>" + id + "</strong> has been <strong style='color:green'> ACCEPTED </strong> successfully!");

    //  const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
    //    disableClose: true,
    //    data: { action, title, message }
    //  });

    //  const duration = 1750;
    //  setTimeout(() => {
    //    this.router.navigate(['/Delegation'], { queryParams: { refresh: true } });
    //    dialogRef.close();
    //  }, duration);
    //})
  }
}
