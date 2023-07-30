import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteHelpComponent } from 'src/app/delete-help/delete-help/delete-help.component';
import { Help_Category } from 'src/app/Shared/HelpCategory';
import { Help } from 'src/app/Shared/Help';
import { DataService } from 'src/app/DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { HttpClient } from '@angular/common/http';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { VideoDialogComponent } from 'src/app/VideoDialog/video-dialog/video-dialog.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { RestoreComponent } from 'src/app/Settings/backupDialog/restore.component';
import { RestoreDialogComponent } from 'src/app/Settings/restore-dialog/restore-dialog.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};



@Component({
  selector: 'app-view-help',
  templateUrl: './view-help.component.html',
  styleUrls: ['./view-help.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ViewHelpComponent implements OnInit {
  displayedColumnsAdmin: string[] = ['helpCategory', 'name', 'description', 'video', 'user_Manual',  'action', 'delete'];
                                  //'help_ID',
  displayedColumnsUser: string[] = [ 'helpCategory', 'name', 'description', 'video', 'user_Manual'];
                                 //'help_ID',
  dataSource = new MatTableDataSource<Help>();

  HelpToDelete:any  = {
    help_ID :0,
    name:'',
    description:'',
    video:'',
    user_Manual:'',
  }


  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,private http: HttpClient, private sanitizer: DomSanitizer) { }

  DeleteHelp: Help[] = [];
  Helps: Help[] = [];
  HelpCategorys: Help_Category[] = [];
  FileDetails:any[] = [];
  vFileDetails:any[]=[];
  SearchedHelp: Help[] = [];
  searchWord: string = "";


  iRole: string;
  rAdmin: string;
  rUser: string;
  ngOnInit() {

    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
    }else{
      this.rUser = "true";
    }
    this.GetHelps();

  }



  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
  
    if (searchTerm) {
      this.SearchedHelp = this.Helps.filter(help => help.name.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedHelp = [...this.Helps]
    }
  }



  GetHelps() {
    this.dataService.GetHelps().subscribe(result => {
      if (result) {
        hideloader();
      }
      this.Helps = result;
      this.SearchedHelp = this.Helps;
      for (let i = 0; i < this.Helps.length; i++) {
        this.FileDetails.push({ FileURL: "", FileName: "" })
        this.vFileDetails.push({ FileURL: "", FileName: "" })
        let sFile = this.Helps[i].user_Manual;
        let vFile = this.Helps[i].video;

        if (sFile != "None") {
          let HelpName = sFile.substring(0, sFile.indexOf("\\"))
          let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)

          this.FileDetails[i].FileURL = `https://localhost:7186/api/Help/GetHelpPDFFiles/${HelpName}/${filename}`
          this.FileDetails[i].FileName = filename
        }
        else {
          this.FileDetails[i].FileURL = ""
          this.FileDetails[i].FileName = sFile;
        }

        if (vFile != "None") {
          let vHelpName = vFile.substring(0, vFile.indexOf("\\"))
          let vfilename = vFile.substring(vFile.indexOf("\\") + 1, vFile.length)

          this.vFileDetails[i].FileURL = `https://localhost:7186/api/Help/GetHelpVideoFiles/${vHelpName}/${vfilename}`
          this.vFileDetails[i].FileName = vfilename
        }
        else {
          this.vFileDetails[i].FileURL = ""
          this.vFileDetails[i].FileName = vFile;
        }
      }
      console.log(result)
    });
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
  }

 

  DeleteRequest(help_ID: Number) {
    const confirm = this.dialog.open(DeleteHelpComponent, {
      disableClose: true,
      data: { help_ID }
    });
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }


  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
      URL.revokeObjectURL(fileURL);
    });
    
  }

  openUserManualInNewTab(): void {
    const userManualUrl = 'assets/PDF/Procurement Manual.pdf'; 
    window.open(userManualUrl, '_blank');
  }

  //openVideoInNewTab(i: number): void {
  //  const url = this.vFileDetails[i].FileURL;
  //  this.http.get(url, { responseType: 'blob' }).subscribe(response => {
  //    const fileURL = URL.createObjectURL(response);  
  //    window.open(fileURL, '_blank');
  //    URL.revokeObjectURL(fileURL);
  //  });
  //
  // }

 // openVideoInNewTab(i: number): void {
 //   const videoUrl = this.vFileDetails[i].FileURL;
 //   const dialogRef = this.dialog.open(VideoDialogComponent, {
 //     width: '560px',
 //     height: '315px',
 //     data: { videoUrl },
 //   });
 // }

 openVideoInNewTab(videoUrl: string): void {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      //width: '1000px',
      //height: '800px',
      data: { videoUrl },
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(RestoreComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRestoreDialog() {
    const dialogRef = this.dialog.open(RestoreDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
