import { Component, OnInit } from '@angular/core';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { DataService } from '../DataService/data-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [MainNavComponent],
})
export class HomePageComponent implements OnInit {

  iRole: string;
  rAdmin: string;

  constructor(private nav: MainNavComponent, private dataService: DataService) { }

  ngOnInit(): void {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    console.log(this.iRole)

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
    }

    document.getElementById('nav').style.visibility = "visible";
    this.nav.reload();
  }

}
