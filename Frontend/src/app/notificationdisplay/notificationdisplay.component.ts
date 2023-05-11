import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-notificationdisplay',
  templateUrl: './notificationdisplay.component.html',
  styleUrls: ['./notificationdisplay.component.css']
})
export class NotificationdisplayComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string, title: string, message: string }) { }
  Action = this.data.action;
  Title = this.data.title;
  Message = this.data.message;

}
