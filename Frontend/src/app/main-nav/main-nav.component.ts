import { Component, OnInit, ChangeDetectorRef, Injectable, DoCheck, AfterViewInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuthService } from '../DataService/AuthService';

import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
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

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: '',
    role: this.rl
  }

  previousRoute: string;

  constructor(private router: Router, private dataService: DataService, private AuthServ: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.reload();
      }
    })
  }
  RoleToUse: string = "";
  IsLoggedIn: boolean = false;

  ngOnInit() {
    this.AuthServ.userRole$.subscribe(role => {
      this.RoleToUse = role
      this.isLoggedIn = true;
    })
    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
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

  Logout() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("tokenExpiration")
    this.router.navigate([""]);
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
}
