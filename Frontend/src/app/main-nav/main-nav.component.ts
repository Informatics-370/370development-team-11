import { Component, OnInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuthService } from '../DataService/AuthService';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})



export class MainNavComponent implements OnInit {
  constructor(private router: Router, private dataService: DataService, private AuthServ: AuthService) { }
  RoleToUse: string = "";

  IsLoggedIn: boolean = false;
  ngOnInit() {
    this.AuthServ.userRole$.subscribe(role => {
      this.RoleToUse = role
      this.IsLoggedIn = true;
    })


  }

  Logout() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("tokenExpiration")
    this.router.navigate([""]);
  }


}
