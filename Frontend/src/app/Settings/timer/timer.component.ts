import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../DataService/data-service';
import { BackupComponent } from '../backup/backup.component';
import { UserSettings } from 'src/app/Shared/UserSettings';
import { SafeKeyedRead } from '@angular/compiler';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder, private dataservice: DataService, private router: Router, private dialogRef: MatDialogRef<BackupComponent>, private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  Timer: UserSettings = {
    setting_ID: 0,
    timerDuration: 0,
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      Timer: [0, [Validators.required, Validators.pattern("^[0-9]+$")]]
    })

    this.dataservice.GetTimerDuration().subscribe({
      next: (time) => {
        this.Timer = time;
        this.myForm.patchValue({
          Timer: this.Timer.timerDuration
        })
      }
    })
  }

  onSubmit() {
    let Time = this.myForm.get("Timer").value;
    let ID = this.Timer.setting_ID;

    this.dataservice.UpdateTime(ID, Time).subscribe({
      next: (Response) => {
        var action = "CREATE";
        var title = "CREATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The timer has been updated to <strong style='color:green'>" + this.Timer.timerDuration + "</strong><strong style='color:green'> SECONDS </strong>");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          dialogRef.close();
          this.dialogRef.close();
        }, duration);
      }
    });
  }

  Close() {
    this.dialogRef.close()
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }
}
