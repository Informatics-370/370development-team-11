import { Component, OnInit } from '@angular/core';
import { DataService } from '../../DataService/data-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from '../../Shared/Admin';
import { Role } from '../../Shared/EmployeeRole';
import { User } from '../../Shared/User';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  file: string = '';
  iName: string;
  iRole: string;
  admin: any;

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

  adm: Admin = {
    admin_ID: 0,
    user_Id: 0,
    adminName: '',
    adminSurname: '',
    cellPhone_Num: '',
    email: '',
    user: this.usr,
  }

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService) { }

  ngOnInit(): void {
    this.iName = localStorage.getItem("User");
    this.iName = this.iName.substr(1, this.iName.length - 2);
    this.iRole = localStorage.getItem("Role");
    this.iRole = this.iRole.substr(1, this.iRole.length - 2);
    this.GetAdmin();

    console.log(this.iRole)
    if (this.iRole == "Admin") {
      console.log(this.iName)
    } else {

    }
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
