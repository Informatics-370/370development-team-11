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

  ngOnInit() {
    this.GetAdmins();
  }

  GetAdmins() {
    this.dataService.GetAdmins().subscribe(result => {
      this.dataSource = result;
    });
  }

  DeleteAdmin(id: Number) {
    const confirm = this.dialog.open(DeleteAdminComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
