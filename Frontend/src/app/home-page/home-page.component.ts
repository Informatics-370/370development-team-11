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
  constructor(private nav: MainNavComponent, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    console.log(this.iRole)

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
    }else{
      this.rUser = "true";
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
