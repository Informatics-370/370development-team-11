import { Component, OnInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private router: Router, private dataService: DataService, private AuthServ: AuthService) { }
  RoleToUse: string = "";
  ngOnInit() {
    this.AuthServ.userRole$.subscribe(role => {
      this.RoleToUse = role
    })
  }

  Logout() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("tokenExpiration")
    this.router.navigate([""]);
  }


  iName: string;
  iRole: string;
  user: any;

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

  // ngOnInit(): void {
  //   this.iName = localStorage.getItem("User");
  //   this.iName = this.iName.substr(1, this.iName.length - 2);
  //   this.iRole = localStorage.getItem("Role");
  //   this.iRole = this.iRole.substr(1, this.iRole.length - 2);
  //   this.GetUser()
    
  // }

  // GetUser() {
  //   this.dataService.GetUserByUsername(this.iName).subscribe(result => {
  //     this.user = result
  //     this.rl.description = this.user.role.description;
  //     this.usr.profile_Picture = this.user.profile_Picture;
  //     this.usr.username = this.user.username;
  //     this.usr.password = this.user.password;
  //   })
    
  // }
}
