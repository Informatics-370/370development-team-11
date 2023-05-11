import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { Employee } from '../Shared/Employee';
import { DataService } from '../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'role', 'branch', 'department', 'mandate limit', 'action', 'delete'];
  dataSource = new MatTableDataSource<Employee>();

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  Employees: Employee[] = [];

  ngOnInit() {
    this.GetEmployees();
  }

  GetEmployees() {
    this.dataService.GetEmployees().subscribe(result => {
      this.dataSource = result;
    });
  }

  DeleteEmployee(id: Number) {
    const confirm = this.dialog.open(DeleteEmployeeComponent, {
      disableClose: true,
      data: { id }
    });
  }
}
