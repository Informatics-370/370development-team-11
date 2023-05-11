import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/Shared/Department';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteDepartmentComponent } from 'src/app/delete-department/delete-department/delete-department.component';
import { DataService } from 'src/app/DataService/data-service';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit{
  Departments: Department[] = [];
  displayedColumns: string[] = ['department_ID','name', 'description', 'action', 'delete'];
  dataSource = new MatTableDataSource<Department>();

  constructor(private dataService: DataService, private Dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.GetDepartments();
    console.log(this.Departments)
  }

 

  GetDepartments() {
    this.dataService.GetDepartments().subscribe(result => {
      this.dataSource = result;
    });  
  }

  DeleteDepartment(department_ID: Number) {
    const confirm = this.Dialog.open(DeleteDepartmentComponent, {
      disableClose: true,
      data: { department_ID }
    });
  }
}
