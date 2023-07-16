import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteMandateLimitComponent } from '../delete-mandate-limit/delete-mandate-limit.component';
import { DatePipe } from '@angular/common';
import { Employee } from '../Shared/Employee';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';


@Component({
  selector: 'app-view-mandate-limit',
  templateUrl: './view-mandate-limit.component.html',
  styleUrls: ['./view-mandate-limit.component.css']
})
export class ViewMandateLimitComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'date', 'action', 'delete'];
  dataSource = new MatTableDataSource<Mandate_Limit>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,
    private sanitizer: DomSanitizer) { }

  deleteMandateLimit: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249'
  }
  Employees: Employee[] = [];
  Mandate_Limits: Mandate_Limit[] = [];
  RoleToUse: string = "";
  SearchedMandate_Limits: Mandate_Limit[] = [];
  searchNumber: Number = 0;
  iRole: string;
  rAdmin: string;

  OnInPutChange() {
    const Searchterm = this.searchNumber;

    if (Searchterm) {
      this.SearchedMandate_Limits = this.Mandate_Limits.filter(mandateLimit => mandateLimit.ammount == Searchterm)
    }
    else if (Searchterm == 0) {
      this.SearchedMandate_Limits = [...this.Mandate_Limits];
    }

    this.dataSource = new MatTableDataSource<Mandate_Limit>(this.SearchedMandate_Limits);
  }

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetMandateLimits();
  }

  GetMandateLimits() {
    this.dataService.GetMandateLimits().subscribe(result => {
      this.Mandate_Limits = result;
      this.dataSource = new MatTableDataSource(this.Mandate_Limits);
    });
  }
  DeleteMandateLimit(id: Number) {
    this.dataService.GetEmployees().subscribe({
      next: (result) => {
        let EmployeeList: any[] = result
        EmployeeList.forEach((element) => {
          this.Employees.push(element)
        });
        console.log(this.Employees)
        var Count: number = 0;
        this.Employees.forEach(element => {
          if (element.mandate_ID == id) {
            Count = Count + 1;
            console.log(Count)
          }
        });

        if (Count == 0) {
          const confirm = this.dialog.open(DeleteMandateLimitComponent, {
            disableClose: true,
            data: { id }
          });
        }
        else {

          this.dataService.GetMandateLimit(id).subscribe({
            next: (mandateReceived) => {
              this.deleteMandateLimit = mandateReceived as Mandate_Limit;
            }
          })
          var action = "ERROR";
          var title = "ERROR: Mandate Limit In Use";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Mandate Limit with amount <strong>" + this.deleteMandateLimit.ammount + " <strong style='color:red'>IS ASSOCIATED WITH AN EMPLOYEE!</strong><br> Please remove the mandate limit from the employee to continue with deletion.");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 4000;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })
  }

}
