import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService } from '../DataService/AuthService';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from '../Shared/Access';
import { Storage } from '@ionic/storage-angular'; // Ionic storage for session management

@Component({
  selector: 'app-logout-popover',
  templateUrl: './logout-popover.component.html',
  styleUrls: ['./logout-popover.component.scss'],
})
export class LogoutPopoverComponent implements OnInit {
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
    IsAdmin: '',
    CanAccInv: '',
    CanAccFin: '',
    CanAccPro: '',
    CanAccVen: '',
    CanAccRep: '',
    CanViewPenPro: '',
    CanViewFlagPro: '',
    CanViewFinPro: '',
    CanAppVen: '',
    CanEditVen: '',
    CanDeleteVen: '',
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: '',
    no_Notifications: 0,
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
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
  tempUsernotifications: any;
  numNotifications: number;
  iTempUsername: string;
  hasTempAcc: string;

  hidden = false;
  constructor(private popoverController: PopoverController, private navController: NavController, private AuthService: AuthService, private dataService: DataService, private storage: Storage) {
    this.init();
  }

  ngOnInit() { }
  async logout() {
    this.popoverController.dismiss();

    this.log.action = "Manually Logged out of the mobile system";
    const token = await this.storage.get('token');
    this.log.user = this.dataService.decodeUser(token);
    let test: any
    test = new DatePipe('en-ZA');
    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
    this.dataService.AuditLogAdd(this.log).subscribe({
      next: (Log) => {
        this.storage.remove('token');
        this.storage.remove('tokenExpiration');
        this.navController.navigateForward(['']);
      }
    })

  }

  async init() {
    await this.storage.create();
  }

}
