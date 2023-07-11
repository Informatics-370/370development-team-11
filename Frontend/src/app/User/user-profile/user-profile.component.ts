import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from '../../Shared/Admin';
import { Role } from '../../Shared/EmployeeRole';
import { User } from '../../Shared/User';
import { Branch } from '../../Shared/Branch';
import { Department } from '../../Shared/Department';
import { Mandate_Limit } from '../../Shared/MandateLimit';
import { Employee } from '../../Shared/Employee';
import { MainNavComponent } from '../../main-nav/main-nav.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MainNavComponent],
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  file: string = '';
  iName: string;
  iRole: string;
  rAdmin: string;
  admin: any;
  employee: any;

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    username: '',
    password: '',
    profile_Picture: '',
    role: this.rl
  }

  br: Branch = {
    branch_ID: 0,
    name: '',
    street: '',
    city: '',
    postal_Code: '',
    province: '',
  }

  dep: Department = {
    department_ID: 0,
    name: '',
    description: ''
  }

  ml: Mandate_Limit = {
    mandate_ID: 0,
    ammount: 0,
    date: '2023-05-07T12:14:46.249Z',
  }

  emp: Employee = {
    employeeID: 0,
    user_Id: 0,
    department_ID: 0,
    branch_ID: 0,
    mandate_ID: 0,
    employeeName: '',
    employeeSurname: '',
    cellPhone_Num: '',
    email: '',
    branch: this.br,
    department: this.dep,
    user: this.usr,
    mandate_limit: this.ml
  }

  adm: Admin = {
    admin_ID: 0,
    user_Id: 0,
    adminName: '',
    adminSurname: '',
    cellPhone_Num: '',
    email: '',
    user: this.usr,
  }

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private nav: MainNavComponent) { }

  ngOnInit(): void {
    this.iName = this.dataService.decodeUser(sessionStorage.getItem("token"));
    this.iRole = this.dataService.decodeUserRole(sessionStorage.getItem("token"));
    

    
    if (this.iRole == "Admin") {
      this.rAdmin = "true";
      this.GetAdmin();
    } else {
      this.GetEmployee();      
    }
  }

  ngAfterViewInit(): void {
    this.nav.reload();
  }

  GetEmployee() {
    this.dataService.GetEmployeeByUsername(this.iName).subscribe(result => {
      this.employee = result
      this.emp.employeeName = this.employee.employeeName;
      this.emp.employeeSurname = this.employee.employeeSurname;
      this.emp.cellPhone_Num = this.employee.cellPhone_Num;
      this.emp.email = this.employee.email;
      this.rl.description = this.employee.user.role.description;
      this.usr.profile_Picture = this.employee.user.profile_Picture;
      this.usr.username = this.employee.user.username;
      this.usr.password = this.employee.user.password;
      this.ml.ammount = this.employee.mandate_Limit.ammount;
      this.dep.description = this.employee.department.description;
      this.br.name = this.employee.branch.name;
    })
  }

  GetAdmin() {
    this.dataService.GetAdminByUsername(this.iName).subscribe(result => {
      this.admin = result
      this.adm.adminName = this.admin.adminName;
      this.adm.adminSurname = this.admin.adminSurname;
      this.adm.cellPhone_Num = this.admin.cellPhone_Num;
      this.adm.email = this.admin.email;
      this.rl.description = this.admin.user.role.description;
      this.usr.profile_Picture = this.admin.user.profile_Picture;
      this.usr.username = this.admin.user.username;
      this.usr.password = this.admin.user.password;
    })
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.resetInput();
    }

  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
}
