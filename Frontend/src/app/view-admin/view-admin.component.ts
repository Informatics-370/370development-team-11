import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { Admin } from '../Shared/Admin';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-admin',
  templateUrl: './view-admin.component.html',
  styleUrls: ['./view-admin.component.css']
})
export class ViewAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'role', 'action', 'delete'];
  dataSource = new MatTableDataSource<Admin>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  Admins: Admin[] = [];
  SearchedAdmin: Admin[] = [];
  searchWord: string = "";

  RoleToUse: string = "";
  iRole: string;
  rAdmin: string;

  ngOnInit() {
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));

    if (this.iRole == "Admin") {
      this.rAdmin = "true";
    }

    this.RoleToUse = localStorage.getItem("Role")
    this.GetAdmins();
  }

  search() {
    const searchTerm = this.searchWord.toLocaleLowerCase();
    console.log(searchTerm);
    console.log(this.Admins)


    if (searchTerm) {
      this.SearchedAdmin = this.Admins.filter(r => r.adminName.toLocaleLowerCase().includes(searchTerm))
    }
    else if (searchTerm == "") {
      this.SearchedAdmin = [...this.Admins]
    }
  }

  GetAdmins() {
    this.dataService.GetAdmins().subscribe(result => {
      if (result) {
        hideloader();
      }
      this.Admins = result;
      this.SearchedAdmin = this.Admins;
    });
    function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
      document.getElementById('table').style.visibility = "visible";
    }
  }

  DeleteAdmin(id: Number) {
    const confirm = this.dialog.open(DeleteAdminComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
