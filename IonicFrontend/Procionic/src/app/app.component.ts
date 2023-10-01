import { Component } from '@angular/core';
import { AuthService } from './DataService/AuthService';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoggedIn: boolean;
  RoleToUse: string;

  constructor(private authService: AuthService, private navController: NavController) { }

  ngOnInit() {
    this.checkLogin();
  }

  async checkLogin() {
    this.isLoggedIn = await this.authService.isLoggedIn();
    if (this.isLoggedIn == false) {
      this.navController.navigateForward([''])
    }

    else {
      this.navController.navigateForward(['/tabs/Home'])
    }

  }
}
