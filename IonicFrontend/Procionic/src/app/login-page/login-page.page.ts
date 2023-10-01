import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from '../DataService/data-service';
import { AuthService } from '../DataService/AuthService';
import { MailData } from '../Shared/Mail';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Role } from '../Shared/EmployeeRole';
import { Access } from '../Shared/Access';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';
import { DelegationStatus } from '../Shared/DelegationStatus';
import { Temporary_Access } from '../Shared/Temporary_Access';
import { Delegation_Of_Authority } from '../Shared/DelegationOfAuthority';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Ionic storage for session management
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {
  userName: string = "";
  password: string = "";
  loginConfirm: string = "";

  mail: MailData = {
    Name: '',
    Username: '',
    Password: '',
    Email: ''
  }

  Email: string = "";

  myForm: FormGroup = new FormGroup({});

  fPass: FormGroup = new FormGroup({});

  activeDelegations: Delegation_Of_Authority[] = [];
  hasActiveDelegation: string = "";
  delID: any;

  tempAccess: any;
  tempUsername: any;
  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }
  Access: Access = {
    Access_ID: 0,
    IsAdmin: 'false',
    CanAccInv: 'false',
    CanAccFin: 'false',
    CanAccPro: 'false',
    CanAccVen: 'false',
    CanAccRep: 'false',
    CanViewPenPro: 'false',
    CanViewFlagPro: 'false',
    CanViewFinPro: 'false',
    CanAppVen: 'false',
    CanEditVen: 'false',
    CanDeleteVen: 'false',
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    no_VenNotifications: 0,
    no_InvNotifications: 0,
    no_DelNotifications: 0,
    no_ProNotifications: 0,
    role: this.rl
  }

  adm: Admin = {
    admin_ID: 0,
    user_Id: 0,
    adminName: '',
    adminSurname: '',
    cellPhone_Num: '',
    email: '',
    user: this.usr,
  }

  doas: DelegationStatus = {
    status_ID: 0,
    name: '',
    description: ''
  }

  doa: Delegation_Of_Authority = {
    delegation_ID: 0,
    user_Id: 0,
    admin_ID: 0,
    delegationStatus_ID: 0,
    from_Date: new Date(),
    to_Date: new Date(),
    delegation_Document: '',
    delegatingParty: '',
    user: this.usr,
    admin: this.adm,
    delegation_Status: this.doas
  }

  tA: Temporary_Access = {
    temp_Access_ID: 0,
    delegation_ID: 0,
    delegation_Of_Authority: this.doa,
    name: '',
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
  constructor(private formBuilder: FormBuilder, private navController: NavController, private dataService: DataService, private storage: Storage, private AuthServ: AuthService, private alertController: AlertController) {
    this.init();
  }

  ngOnInit() {
    // document.getElementById('nav').style.visibility = "hidden";

    this.myForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    })
  }

  async init() {
    await this.storage.create();
  }
  async LoginUser() {
    this.loginConfirm = await this.storage.get("User");
    this.userName = this.myForm.get('UserName')?.value;
    this.password = this.myForm.get('Password')?.value;

    this.dataService.GetActiveDelegations().subscribe({
      next: async (r) => {
        this.activeDelegations = r;

        for (let i = 0; i < this.activeDelegations.length; i++) {
          let un = this.activeDelegations[i].user.username;
          if (un == this.userName) {
            this.hasActiveDelegation = "true";
            this.delID = this.activeDelegations[i].delegation_ID;
            this.tempUsername = this.activeDelegations[i].delegatingParty;
          }
        }

        if (this.hasActiveDelegation != "") {
          this.dataService.GetLoginTempAcc(this.delID).subscribe({
            next: (ta) => {
              this.tempAccess = ta;
              this.tA = this.tempAccess;
              this.tA.delegation_Of_Authority = this.doa;
              this.dataService.loginWithTemp(this.userName, this.password, this.tempAccess, this.tempUsername).subscribe({
                next: async (response) => {
                  if (response != null) {
                    this.storage.set("token", JSON.stringify(response));
                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours
                    this.storage.set("tokenExpiration", expirationDate.getTime().toString());


                    const token = await this.storage.get("token");
                    this.AuthServ.setUserRole(this.dataService.decodeUserRole(token))

                    this.myForm.reset();
                    this.navController.navigateForward(['/tabs/Home']);
                  }


                },
                error: async (error) => {
                  if (error.status === 401) {
                    // Unauthorized: Invalid credentials
                    const alert = await this.alertController.create({
                      header: 'Login Failed',
                      message: 'Your Username/Password is incorrect.',
                      buttons: ['OK']
                    });
                    await alert.present();
                  } else {
                    // Handle other errors
                    // ...
                  }
                }
              })
            }
          })
        } else {
          this.dataService.login(this.userName, this.password).subscribe({
            next: async (response) => {
              if (response != null) {

                const stringToken = JSON.stringify(response)

                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + 3 * 60 * 60 * 1000); // Expires in 3 hours

                await this.storage.set("token", stringToken);
                await this.storage.set("tokenExpiration", expirationDate.getTime().toString());



                const token = await this.storage.get("token");
                this.AuthServ.setUserRole(this.dataService.decodeUserRole(token))
                this.log.action = "Logged In to the system via Mobile";
                this.log.user = this.dataService.decodeUser(token);
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    this.myForm.reset();
                    this.navController.navigateForward(['/tabs/Home']);
                  }
                })


              }


            },
            error: async (error) => {

              if (error.status === 401) {
                // Unauthorized: Invalid credentials
                const alert = await this.alertController.create({
                  header: 'Login Failed',
                  message: 'Your Username/Password is incorrect.',
                  buttons: ['OK']
                });
                await alert.present();
              } else {
                // Handle other errors
                // ...
              }
            }
          })
        }
      }
    })
  }

}
