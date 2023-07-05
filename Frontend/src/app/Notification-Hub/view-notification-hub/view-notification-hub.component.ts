import { Component } from '@angular/core';

@Component({
  selector: 'app-view-notification-hub',
  templateUrl: './view-notification-hub.component.html',
  styleUrls: ['./view-notification-hub.component.css']
})
export class ViewNotificationHubComponent {
  todayDate: Date = new Date();
}
