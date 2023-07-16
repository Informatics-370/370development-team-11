import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consumable } from '../Shared/Consumable';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';


@Component({
  selector: 'app-delete-consumable',
  templateUrl: './delete-consumable.component.html',
  styleUrls: ['./delete-consumable.component.css']
})
export class DeleteConsumableComponent implements OnInit {
  Consumables: Consumable = {
    consumable_ID: 0,
    consumable_Category_ID: 0,
    name: '',
    description: '',
    on_Hand: 0,
    minimum_Reorder_Quantity: 0,
    maximum_Reorder_Quantity: 0,
    consumable_Category: { consumable_Category_ID: 0, name: "", description: "" }
  }
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteConsumableComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;
        console.log(ID);

        if (ID) {
          this.dataService.GetConsumableByID(ID).subscribe(result => {
            this.Consumables = result;
          });
        }
      }
    });


  }

  onConfirm(id: number): void {
    this.dataService.DeleteConsumable(id).subscribe({
      next: (response) => {
        this.showConfirmationDialog = false;
        this.showSuccessDialog = true;
        setTimeout(() => {
          this.dialogRef.close();
          this.route.navigate(['/ViewConsumable']);
        }, 1750);
      }
    });
  }





  onCancel(): void {
    this.dialogRef.close();
  }
}
