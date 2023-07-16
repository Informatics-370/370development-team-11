import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteHelpComponent } from 'src/app/delete-help/delete-help/delete-help.component';
import { HelpCategory } from 'src/app/Shared/HelpCategory';
import { Help } from 'src/app/Shared/Help';
import { DataService } from 'src/app/DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { HttpClient } from '@angular/common/http';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';




@Component({
  selector: 'app-view-help',
  templateUrl: './view-help.component.html',
  styleUrls: ['./view-help.component.css']
})
export class ViewHelpComponent implements OnInit {
  displayedColumnsAdmin: string[] = ['help_ID', 'name', 'description', 'video', 'user_Manual', 'helpCategory', 'action', 'delete'];
  displayedColumnsUser: string[] = ['help_ID', 'name', 'description', 'video', 'user_Manual', 'helpCategory'];
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
  HelpCategorys: HelpCategory[] = [];
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
  }


  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
    // window.open(url, '_blank');
  }

  openVideoInNewTab(i: number): void {
    const url = this.vFileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
    // window.open(url, '_blank');
  }

}
