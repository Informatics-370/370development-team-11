import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutPopoverComponent } from '../logout-popover/logout-popover.component';

@Component({
  selector: 'app-view-procurement-details',
  templateUrl: './view-procurement-details.page.html',
  styleUrls: ['./view-procurement-details.page.scss'],
})
export class ViewProcurementDetailsPage implements OnInit {
  procurementDetails: Procurement_Details[] = [];

  constructor(private dataService: DataService, public alertController: AlertController, private navController: NavController, private popoverController: PopoverController) { }
  iRole: string;

  iCanViewFlagPro: string = "false";
  canViewFlagPro: string;

  iCanViewPenPro: string = "false";
  canViewPenPro: string;

  ngOnInit() {
    this.GetProcurementDetails();

  }

  GetProcurementDetails() {
    this.dataService.GetProcurementRequestDetails().subscribe(result => {
      let procurementDetailsList: any[] = result;
      procurementDetailsList.forEach(e => {
        if (e.procurement_Status.name != "Flagged" && e.procurement_Status.name != "Rejected") {
          this.procurementDetails.push(e)
        }
      })


    });


  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'done':
        return 'green'; // Set the color you want for 'Pending'
      case 'awaiting delivery':
        return 'orange';
      case 'item received and checked':
        return 'blue';
      case 'item received and checked':
        return 'blue';
      case 'asset registered':
        return 'blue';// Set the color you want for 'Approved'
      case 'asset to be registered':
        return 'blue';
      default:
        return 'black'; // Default color if the status doesn't match any case
    }
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
