import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Help } from 'src/app/Shared/Help';

@Component({
  selector: 'app-delete-help',
  templateUrl: './delete-help.component.html',
  styleUrls: ['./delete-help.component.css']
})
export class DeleteHelpComponent  implements OnInit{

  Help: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteHelpComponent>, private ActRoute: ActivatedRoute, private route: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { help_ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.help_ID;
        

        if (ID) {
          this.dataService.GetHelp(ID).subscribe(result => {
            this.Help = result
          });
        }
      }
    });


  }


  HelpRequestDetails: any[] = [];
  onConfirm(ID: number): void {
     for(let i = 0; i < this.HelpRequestDetails.length; i++) {
       let sFile = this.HelpRequestDetails[i].quotes;
             let sFi = sFile.substring(0,sFile.indexOf("\\"))
              sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
             let sOR = sFile.substring(0,sFile.indexOf("\\"))
             sFile = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
             let HelpName = sFile.substring(0,sFile.indexOf("\\"))
             let filename = sFile.substring(sFile.indexOf("\\")+1,sFile.length)
         this.dataService.DeleteHelpFile(HelpName,filename).subscribe!
         this.dataService.DeleteHelp(ID).subscribe({
           next: (response) => {
             this.showConfirmationDialog = false;
             this.showSuccessDialog = true;
             setTimeout(() => {
               this.dialogRef.close();
               location.reload();
             }, 1750);
           }
         });
     }
    
   }





  onCancel(): void {
    this.dialogRef.close();
  }

}
