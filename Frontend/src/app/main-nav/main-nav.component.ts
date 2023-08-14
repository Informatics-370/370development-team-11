import { Component, OnInit, ChangeDetectorRef, Injectable, DoCheck, AfterViewInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuthService } from '../DataService/AuthService';
import { interval, Observable } from 'rxjs';


import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from '../Shared/Access';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})



export class MainNavComponent implements OnInit {


  iName: string;
  user: any;
  isLoggedIn: boolean = false;

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  Access: Access = {
    Access_ID: 0,
    IsAdmin: false,
    CanAccInv: false,
    CanAccFin: false,
    CanAccPro: false,
    CanAccVen: false,
    CanAccRep: false,
    CanViewPenPro: false,
    CanViewFlagPro: false,
    CanViewFinPro: false,
    CanAppVen: false,
    CanEditVen: false,
    CanDeleteVen: false,
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    role: this.rl
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  previousRoute: string;

  iRole: string;
  rAdmin: string;
  usernotifications: any;
  numNotifications: number;

  hidden = false;

  constructor(private router: Router, private dataService: DataService, private AuthServ: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.reload();
      }
    })

    interval(10000).subscribe(x => {
      this.dataService.GetUserByUsername(this.iName).subscribe(r => {
        this.usernotifications = r;
        this.numNotifications = this.usernotifications.no_Notifications;

        if (this.numNotifications == 0) {
          this.hidden = true;
        }
        else {
          this.hidden = false;
        }
      })
    })
  }
  RoleToUse: string = "";
  IsLoggedIn: boolean = false;

  ngOnInit() {
    this.AuthServ.userRole$.subscribe(role => {
      this.RoleToUse = role
      console.log(role)
      this.isLoggedIn = true;
    })

    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin" || this.iRole == "MD") {
      this.rAdmin = "true";
    }

    this.GetUser()
  }

  public reload() {
    this.AuthServ.userRole$.subscribe(role => {
      this.RoleToUse = role
      this.isLoggedIn = true;
    })
    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
    this.GetUser()
  }

  public resetNotification() {

  }

  Logout(): void {

    this.log.action = "Manually Logged out of the system";
    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.dataService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
        this.router.navigate(['']);
      }
    })

  }

  GetUser() {
    this.dataService.GetUserByUsername(this.iName).subscribe(result => {
      this.user = result
      this.rl.description = this.user.role.description;
      this.usr.profile_Picture = this.user.profile_Picture;
      this.usr.username = this.user.username;
      this.usr.password = this.user.password;
    })
  }

  HelpRoute() {
    if (this.rAdmin) {
      this.router.navigate(['/ViewHelp']);
    }
    else {
      this.router.navigate(['/ViewHelpUser']);
    }
  }

}
