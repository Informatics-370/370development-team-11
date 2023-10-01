import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutPopoverComponent } from '../logout-popover/logout-popover.component';
import { Storage } from '@ionic/storage-angular';
import { AuditLog } from '../Shared/AuditLog';
import { DatePipe } from '@angular/common';
import { Access } from '../Shared/Access';
import { RefreshService } from '../Refresh/refresh.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-procurement-request',
  templateUrl: './view-procurement-request.page.html',
  styleUrls: ['./view-procurement-request.page.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewProcurementRequestPage implements OnInit {
  ProcurementRequests: Procurement_Request[] = [];
  ProcurementQuotes: Procurement_Request_Quote[] = [];
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


  Procurement_Request: Procurement_Request = {
    procurement_Request_ID: 0,
    vendor_ID: 0,
    vendor: {
      vendor_ID: 0,
      vendor_Status_ID: 0,
      vendor_Status: {
        vendor_Status_ID: 0,
        name: "",
        description: ""
      },
      name: "",
      email: "",
      number_Of_Times_Used: 0,
      sole_Supplier_Provided: false,
      preferedVendor: true
    },
    requisition_Status_ID: 0,
    requisition_Status: {
      requisition_Status_ID: 0,
      name: "Approval Required",
      description: ""
    },
    user_ID: 0,
    user: {
      user_Id: 0,
      role_ID: 0,
      access_ID: 0,
      access: this.Access,
      username: "",
      password: "",
      profile_Picture: "",
      no_Notifications: 0,
      no_VenNotifications: 0,
      no_InvNotifications: 0,
      no_DelNotifications: 0,
      no_ProNotifications: 0,
      role: {
        role_ID: 0,
        name: "",
        description: ""
      }
    },
    name: "",
    description: ""
  }

  constructor(private dataService: DataService, public alertController: AlertController, private http: HttpClient, private sanitizer: DomSanitizer, private navController: NavController, private popoverController: PopoverController, private storage: Storage, private refreshService: RefreshService) { this.init(); }
  FileDetails: any[] = [];
  iRole: string;
  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;
  token: string;
  iCanViewPenPro: string = "false";
  canViewPenPro: string;
  User: string;
  private refreshSubscription: Subscription;
  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }
  getFileDetailsForRequest(procurement_Request_ID: Number) {
    return this.FileDetails.filter(detail => detail.procurement_Request_ID === procurement_Request_ID);
  }

  ngOnInit() {
    this.refreshSubscription = this.refreshService.getRefreshObservable().subscribe(() => {
      this.GetProcurementRequests();
      this.GetPRQuotes();
    });
    // this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    // this.iCanViewFlagPro = this.dataService.decodeCanViewFlagPro(sessionStorage.getItem("token"));
    // this.iCanViewPenPro = this.dataService.decodeCanViewPenPro(sessionStorage.getItem("token"));

    // if (this.iCanViewFlagPro == "true") {
    //   this.canViewFlagPro = "true";
    // }

    // if (this.iCanViewPenPro == "true") {
    //   this.canViewPenPro = "true";
    // }
    this.GetProcurementRequests();
    this.GetPRQuotes()

  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  async init() {
    await this.storage.create();

  }


  async GetProcurementRequests() {
    this.token = await this.storage.get("token");
    this.User = this.dataService.decodeUser(this.token);
    this.dataService.GetProcurementRequestsForUser(this.User).subscribe(result => {
      let procurementRequestList: any[] = result;
      this.ProcurementRequests = [...procurementRequestList];
    });


  }

  GetPRQuotes() {
    this.dataService.GetProcurementQuotes().subscribe({
      next: (response) => {
        this.ProcurementQuotes = response;

        for (let i = 0; i < this.ProcurementQuotes.length; i++) {
          this.FileDetails.push({ FileURL: "", FileName: "" })
          let sFile = this.ProcurementQuotes[i].path;

          if (sFile != "None") {
            let VendorName = sFile.substring(0, sFile.indexOf("\\"))
            let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
            let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

            this.FileDetails[i].FileURL = `https://localhost:7186/api/ProcurementRequest/GetProcurementQuote/${VendorName}/${RequestID}/${filename}`
            this.FileDetails[i].FileName = filename
          }
          else {
            this.FileDetails[i].FileURL = ""
            this.FileDetails[i].FileName = sFile;
          }
        }

      }
    })
  }

  getStatusColor(status: String): string {
    switch (status.toLowerCase()) {
      case 'approval required':
        return 'orange';
      case 'accepted (ready to order)':
        return 'green';
      case 'done':
        return 'green';
      case 'rejected':
        return 'red';

      default:
        return 'black';
    }
  }

  DeleteRequest(ID: Number) {
    this.dataService.ValidatePRRequestDelete(ID).subscribe({
      next: async (IsExist) => {
        if (IsExist == null) {
          // Replacing MatDialog with AlertController for confirmation
          const alert = await this.alertController.create({
            header: 'Confirm Deletion',
            message: 'Do you really want to delete this procurement request?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel'
              },
              {
                text: 'Delete',
                handler: () => {
                  this.dataService.DeletePRRequest(ID).subscribe({
                    next: async (response) => {
                      this.log.action = "Deleted Procurement Request For: " + this.Procurement_Request.name;
                      const token = await this.storage.get("token");
                      this.log.user = this.dataService.decodeUser(token);
                      let test: any
                      test = new DatePipe('en-ZA');
                      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                      this.dataService.AuditLogAdd(this.log).subscribe({
                        next: (Log) => {
                          this.ProcurementQuotes.forEach(element => {

                            if (element.procurement_Request_ID == ID) {
                              let sFile = element.path;
                              let VendorName = sFile.substring(0, sFile.indexOf("\\"))
                              let RequestID = sFile.substring(sFile.indexOf("\\") + 1, (sFile.lastIndexOf("\\")))
                              let filename = sFile.substring(sFile.lastIndexOf("\\") + 1, sFile.length)

                              this.dataService.DeleteProcurementRequestFiles(VendorName, RequestID, filename).subscribe({
                                next: (Result) => {
                                  this.alertController.create({
                                    header: 'Success',
                                    message: 'Successfully deleted the procurement request files.',
                                    buttons: ['OK']
                                  }).then((alertElement) => {
                                    this.ngOnInit();
                                  });
                                }
                              })
                            }
                          });
                        }
                      })

                    }

                  });
                },
                role: 'delete'
              }
            ]
          });
          await alert.present();
          const { role } = await alert.onDidDismiss();
          if (role !== 'cancel') {
            this.ngOnInit();  // Refresh the component
          }
        }
        else {

          const alert = await this.alertController.create({
            header: 'ERROR: Request In Use',
            message: "The Procurement Request is associated with a procurement!",
            buttons: ['OK']
          });
          await alert.present();
          setTimeout(() => {
            alert.dismiss();
          }, 4000);
        }
      }
    });
  }


  EditRequest(ID: Number) {
    this.navController.navigateForward(`/edit-procurement-request/${ID}`);
  }

  CreateRequest() {
    this.navController.navigateForward('/create-procurement-request');
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
