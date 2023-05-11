import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEmployeeRoleComponent } from '../delete-employee-role/delete-employee-role.component';
import { Role } from '../Shared/EmployeeRole';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../DataService/data-service';

@Component({
  selector: 'app-view-employee-role',
  templateUrl: './view-employee-role.component.html',
  styleUrls: ['./view-employee-role.component.css']
})
export class ViewEmployeeRoleComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'action', 'delete'];
  dataSource = new MatTableDataSource<Role>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  Roles: Role[] = [];

  ngOnInit() {
    this.GetRoles();
  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.dataSource = result;
    });  
  }

  DeleteEmpRole(id: Number) {
    const confirm = this.dialog.open(DeleteEmployeeRoleComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
