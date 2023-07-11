import { Component } from '@angular/core';
import { AuthService } from './DataService/AuthService';
import { Router } from '@angular/router';
import { MainNavComponent } from './main-nav/main-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProcionFrontEnd';
  isLoggedIn: boolean;
  RoleToUse: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn == false) {
      this.router.navigate([''])
    }

    else {
      this.router.navigate(['/Home'])
    }
  }
}
