import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { AuditLog } from '../Shared/AuditLog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';



import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-export-ba-picker',
  templateUrl: './export-ba-picker.component.html',
  styleUrls: ['./export-ba-picker.component.css'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ExportBaPickerComponent implements OnInit {

  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<ExportBaPickerComponent>, private formBuilder: FormBuilder, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService, private sanitizer: DomSanitizer, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string }) { }

  exportFilterForm: FormGroup = new FormGroup({});
  SpecMonthChecked = false;
  Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  ngOnInit(): void {
    this.exportFilterForm = this.formBuilder.group({
      SpecMonth: [false],
      Month: ['', [Validators.required]],
    })

    this.exportFilterForm.get("Month")?.disable();

  }

  MonthChange() {
    if (this.exportFilterForm.get("SpecMonth")?.value == true) {
      this.SpecMonthChecked = true;
      this.exportFilterForm.get("Month")?.enable();
    } else {
      this.SpecMonthChecked = false;
      this.exportFilterForm.get("Month")?.disable();
    }
  }

  get f() {
    return this.exportFilterForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.exportFilterForm.controls[controlName].hasError(errorName);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(id: number, name: string): void {
    if (this.exportFilterForm.get("SpecMonth")?.value == true) {
      var month = this.exportFilterForm.get("Month")?.value;

      this.dataService.BudgetAllocationMonthExportValidation(id, month).subscribe(r => {
        var ba = r;

        if (ba != null) {
          this.log.action = "Exported Budget Allocation For Month " + month;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              this.dataService.ExportExcelForMonth(id, name, month)
              this.dialogRef.close();
            }
          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: No Budget Line exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("No Budget Lines exists for the month <strong>" + month + "<strong>!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      })
    }
    else {
      this.log.action = "Exported Budget Allocation";
      this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
      let test: any
      test = new DatePipe('en-ZA');
      this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
      this.dataService.AuditLogAdd(this.log).subscribe({
        next: (Log) => {
          this.dataService.ExportExcel(id, name)
          this.dialogRef.close();
        }
      })
    }
  }




  openExportTab(): void {
    const userManualUrl = 'assets/PDF/ExportUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }

}
