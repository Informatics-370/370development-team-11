import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Notification_Type } from '../../Shared/Notification_Type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-notification-hub',
  templateUrl: './view-notification-hub.component.html',
  styleUrls: ['./view-notification-hub.component.css']
})
export class ViewNotificationHubComponent implements OnInit {
  displayedColumns: string[] = ['id'];
  dataSourceInventory = new MatTableDataSource<Notification>;
  dataSourceVendor = new MatTableDataSource<Notification>;
  dataSourceProcurement = new MatTableDataSource<Notification>;

  iName: string;



  todayDate: Date = new Date();
  VendorNotifications: Notification[] = [];
  InventoryNotifications: Notification[] = [];
  ProcurementNotifications: Notification[] = [];

  constructor(private router: Router, private dataService: DataService, private sanitizer: DomSanitizer, private http: HttpClient, private datePipe: DatePipe) { }

  ngOnInit() {
    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));

    this.dataService.ResetNotif(this.iName).subscribe();

    this.GetVendorNotifications();
    this.GetInventoryNotifications();
    this.GetProcurementNotifications();
  }

  GetVendorNotifications() {
    this.dataService.GetVendorNotifications(this.iName).subscribe(r => {
      this.VendorNotifications = r;
      this.dataSourceVendor = new MatTableDataSource(r);
    })
  }

  GetInventoryNotifications() {
    this.dataService.GetInventoryNotifications(this.iName).subscribe(r => {
      this.InventoryNotifications = r;
      this.dataSourceInventory = new MatTableDataSource(r);
    })
  }

  GetProcurementNotifications() {
    this.dataService.GetProcurementNotifications(this.iName).subscribe(r => {
      this.ProcurementNotifications = r;
      this.dataSourceProcurement = new MatTableDataSource(r);
    })
  }

  VendorRoute(name: string) {
    if (name.includes("Onboard")) {
      this.router.navigate(['/request-view']);
    }
    else {
      this.router.navigate(['/vendor-view']);
    }
  }

  ProcurementRoute(name: string) {
    //if (name.includes("")) {
    //  this.router.navigate(['/']);
    //}
    //else {
    //  this.router.navigate(['/']);
    //}
  }
}
