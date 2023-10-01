import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LogoutPopoverComponent } from '../logout-popover/logout-popover.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
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
