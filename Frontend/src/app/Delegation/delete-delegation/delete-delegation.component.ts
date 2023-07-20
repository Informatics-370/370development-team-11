import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../DataService/data-service';

@Component({
  selector: 'app-delete-delegation',
  templateUrl: './delete-delegation.component.html',
  styleUrls: ['./delete-delegation.component.css']
})
export class DeleteDelegationComponent implements OnInit{

  Delegation: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteDelegationComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.ID;

        if (ID) {
          this.dataService.GetDelegation(ID).subscribe(result => {
            this.Delegation = result;
          })
        }
      }
    })
  }

  onConfirm(id: number): void {
    let sFile = this.Delegation.delegation_Document;
    let DelegateName = sFile.substring(0, sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

    this.dataService.DeleteTempAcc(id).subscribe({
      next: (d) => {
        this.dataService.DeleteDelegation(id).subscribe({
          next: (response) => {
            this.dataService.DeleteDelegationFile(DelegateName, filename).subscribe(r => {
              this.showConfirmationDialog = false;
              this.showSuccessDialog = true;
              setTimeout(() => {
                this.dialogRef.close();
              }, 1750);
            })
          }
        })
      }
    })
    
    
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
