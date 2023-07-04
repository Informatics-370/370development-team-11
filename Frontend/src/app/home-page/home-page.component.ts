import { Component, OnInit } from '@angular/core';
import { MainNavComponent } from '../main-nav/main-nav.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [MainNavComponent],
})
export class HomePageComponent implements OnInit {

  constructor(private nav: MainNavComponent) { }

  ngOnInit(): void {
    document.getElementById('nav').style.visibility = "visible";
    this.nav.reload();
  }

}
