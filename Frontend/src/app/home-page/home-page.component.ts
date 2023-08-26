import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { DataService } from '../DataService/data-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [MainNavComponent],
})
export class HomePageComponent implements OnInit, AfterViewInit {

  iRole: string;
  rAdmin: string;
  rUser: string;
  rAdminUser: string;

  iCanAccInv: string = "false";
  canAccInv: string;

  iCanAccFin: string = "false";
  canAccFin: string;

  iCanAccPro: string = "false";
  canAccPro: string;

  iCanAccVen: string = "false";
  canAccVen: string;

  iCanAccRep: string = "false";
  canAccRep: string;
  constructor(private nav: MainNavComponent, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    this.iCanAccInv = this.dataService.decodeCanAccInv(sessionStorage.getItem("token"));
    this.iCanAccFin = this.dataService.decodeCanAccFin(sessionStorage.getItem("token"));
    this.iCanAccPro = this.dataService.decodeCanAccPro(sessionStorage.getItem("token"));
    this.iCanAccVen = this.dataService.decodeCanAccVen(sessionStorage.getItem("token"));
    this.iCanAccRep = this.dataService.decodeCanAccRep(sessionStorage.getItem("token"));

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
      this.rAdminUser = "true";
    }

    if (this.iRole == "MD") {
      this.rAdmin = "true";
      this.canAccInv = "true";
      this.canAccFin = "true";
      this.canAccPro = "true";
      this.canAccVen = "true";
      this.canAccRep = "true";
    }
    if (this.iCanAccInv == "true") {
      this.canAccInv = "true";
    }
    if (this.iCanAccFin == "true") {
      this.canAccFin = "true";
    }
    if (this.iCanAccPro == "true") {
      this.canAccPro = "true";
    }
    if (this.iCanAccVen == "true") {
      this.canAccVen = "true";
    }
    if (this.iCanAccRep == "true") {
      this.canAccRep = "true";
    }

    document.getElementById('nav').style.visibility = "visible";

    setTimeout(() => {
      this.nav.reload();
    }, 1000);

  }

  ngAfterViewInit(): void {
    /*this.nav.reload();*/
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
