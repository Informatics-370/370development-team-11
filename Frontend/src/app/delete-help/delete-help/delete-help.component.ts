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

  constructor(public dialogRef: MatDialogRef<DeleteHelpComponent>, private ActRoute: ActivatedRoute, private router: Router, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { help_ID: number }) { }

  ngOnInit(): void {
    this.ActRoute.paramMap.subscribe({
      next: (params) => {
        const ID = this.data.help_ID;
        

        if (ID) {
          this.dataService.GetHelp(ID).subscribe(result => {
            console.log(result);
            this.Help = result
          });
        }
      }
    });


  }

/*
  onConfirm(id: number): void {
    let sFile = this.Help.user_Manual + this.Help.video;
    // let vFile = this.Help.video;
    let HelpName = sFile.substring(0, sFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

    this.dataService.DeleteHelpFile(HelpName, filename).subscribe(r => {
      this.dataService.DeleteHelp(id).subscribe({
        next: (response) => {
          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          setTimeout(() => {
            this.dialogRef.close();
            location.reload();
          }, 1750);
        }
      })
    })
    
    
  }
*/

  onConfirm(id: number): void {
    let sFile = this.Help.user_Manual;
    let vFile = this.Help.video;
    let HelpName = sFile.substring(0, sFile.indexOf("\\"))
    let vHelpName = vFile.substring(0, vFile.indexOf("\\"))
    let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
    let vfilename = vFile.substring(vFile.indexOf("\\") + 1, vFile.length)





    this.dataService.DeleteHelpFile(HelpName, filename).subscribe(r => {
    this.dataService.DeleteHelpFile(vHelpName, vfilename).subscribe(d =>{
      this.dataService.DeleteHelp(id).subscribe({
        next: (response) => {
          this.showConfirmationDialog = false;
          this.showSuccessDialog = true;
          setTimeout(() => {
            this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
            this.dialogRef.close();
            
          }, 1750);
        }
      })
    })
    })
    
    
  }





  onCancel(): void {
    this.dialogRef.close();
  }

}
