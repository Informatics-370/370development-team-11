import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Help } from 'src/app/Shared/Help';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-help',
  templateUrl: './delete-help.component.html',
  styleUrls: ['./delete-help.component.css']
})
export class DeleteHelpComponent  implements OnInit{

  Help: any
  showConfirmationDialog: boolean = true;
  showSuccessDialog: boolean = false;

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  constructor(public dialogRef: MatDialogRef<DeleteHelpComponent>, private ActRoute: ActivatedRoute, private router: Router, private dataService: DataService,
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
    let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)

    let vFile = this.Help.video;
    let vStringtouse = vFile.substring(vFile.indexOf("procionfiles/") + 13, vFile.length)

    let HelpName = Stringtouse.substring(Stringtouse.indexOf("/") + 1, Stringtouse.lastIndexOf("/"))
    let vHelpName = vStringtouse.substring(vStringtouse.indexOf("/") + 1, vStringtouse.lastIndexOf("/"))

    let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
    let vfilename = vStringtouse.substring(vStringtouse.lastIndexOf("/") + 1, vStringtouse.length)





    this.dataService.DeleteHelpFile(HelpName, filename).subscribe(r => {
    this.dataService.DeleteHelpFile(vHelpName, vfilename).subscribe(d =>{
      this.dataService.DeleteHelp(id).subscribe({
        next: (response) => {
          this.log.action = "Deleted Help: " + id;
          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
          let test: any
          test = new DatePipe('en-ZA');
          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
          this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
              this.showConfirmationDialog = false;
              this.showSuccessDialog = true;
              setTimeout(() => {
                this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
                this.dialogRef.close();

              }, 1750);
            }
          })
        }
      })
    })
    })
    
    
  }





  onCancel(): void {
    this.dialogRef.close();
  }

}
