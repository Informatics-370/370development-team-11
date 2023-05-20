import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Mandate_Limit } from '../Shared/MandateLimit';


@Component({
  selector: 'app-delete-mandate-limit',
  templateUrl: './delete-mandate-limit.component.html',
  styleUrls: ['./delete-mandate-limit.component.css']
})
export class DeleteMandateLimitComponent {

  mandateLimit: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249'
  }
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteMandateLimitComponent>, private route: ActivatedRoute, private routee: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.id;
        console.log(ID);

        if (ID) {
          this.dataService.GetMandateLimit(ID).subscribe(result => {
            this.mandateLimit = result as Mandate_Limit;
          });
        }
      }
    });
  }

  onConfirm(id: number): void {
    this.dataService.DeleteMandateLimit(id).subscribe({
      next: () => {
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          location.reload();
        }, 1750);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
