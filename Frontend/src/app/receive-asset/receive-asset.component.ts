import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Procurement_Status } from '../Shared/ProcurementStatus';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Notification } from '../Shared/Notification';
import { Notification_Type } from '../Shared/Notification_Type';
import { User } from '../Shared/User';
import { Access } from '../Shared/Access';
import { Role } from '../Shared/EmployeeRole';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-receive-asset',
  templateUrl: './receive-asset.component.html',
  styleUrls: ['./receive-asset.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ReceiveAssetComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private dataService: DataService, private router: Router, private sanitizer: DomSanitizer) { }
  myForm: FormGroup = new FormGroup({});
  Statuses: Procurement_Status[] = [];
  id: Number = 0;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }


  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.GetAssetStatuses().subscribe({
      next: (result) => {
        this.Statuses = result;
      }
    })



    this.myForm = this.formBuilder.group({
      Status: ['', [Validators.required]]
    })
  }

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
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    role: this.rl
  }

  Notification_Type: Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }

  VendorNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };


  onSubmit() {
    document.getElementById('AnimationBtn').setAttribute('disabled', '');
    let StatusID = this.myForm.get("Status")?.value;
    let SelectedStatus = this.Statuses.findIndex(x => x.procurement_Status_ID == StatusID)
    document.getElementById('AnimationBtn').classList.toggle("is_active");
    document.getElementById('cBtn').style.display = "none";
    this.dataService.UpdateProcurementStatus(StatusID, this.id).subscribe({
      next: (Result) => {
        this.log.action = "Changed Asset Status To: " + this.Statuses[Number(SelectedStatus)].name;
        this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe()

        if (StatusID = 7) {
          this.VendorNotification.notification_Type_ID = 19;
          let transVar: any
          transVar = new DatePipe('en-ZA');
          this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
          this.VendorNotification.name = "Procurement Request "+ this.id + " has been received and can be finalised.";
          this.dataService.GetUserByRole("Finance").subscribe(r => {
            var user: any = r;

            this.VendorNotification.user_ID = user.user_Id;
            this.dataService.ProcurementAddNotification(this.VendorNotification).subscribe();
            this.router.navigate(['/ViewProcurementDetails'])
          }) 
        }

        this.router.navigate(['/ViewProcurementDetails'])
      }
    })
  }
  Close() {
    this.myForm.reset();
    this.router.navigate(['/ViewProcurementDetails']);
  }






  openRecieveAssetTab(): void {
    const userManualUrl = 'assets/PDF/ProcAssetReceiveUM .pdf'; 
    window.open(userManualUrl, '_blank');
  }
}
