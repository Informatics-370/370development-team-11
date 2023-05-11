import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../DataService/data-service';
import { Role } from '../Shared/EmployeeRole';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit{
  myForm: FormGroup = new FormGroup({});

  admin: any
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService) { }



  userRoles: any[] = []

  rl: Role = {
    Role_ID: 0,
    Name: '',
    Description: ''
  }

  usr: User = {
    User_Id: 0,
    Role_ID: 0,
    Username: '',
    Password: '',
    Profile_Picture: './assets/Images/Default_Profile.jpg',
    role: this.rl
  }

  adm: Admin = {
    Admin_ID: 0,
    User_Id: 0,
    AdminName: '',
    AdminSurname: '',
    CellPhone_Num: '',
    Email: '',
    user: this.usr,
  }

  ngOnInit() {

    this.GetRoles();
    

    this.myForm = this.formBuilder.group({
      AdminName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      AdminSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      Email: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$')]],
      CellPhone_Num: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9 ]*$")]],
      Role: ['', [Validators.required]],
    })

    this.GetAdmin();


  }

  GetRoles() {
    this.dataService.GetRoles().subscribe(result => {
      this.userRoles = result;
    });
  }

  GetAdmin() {
    this.dataService.GetAdmin(+this.route.snapshot.params['uid']).subscribe(result => {
      this.admin = result
      this.myForm.patchValue({
        AdminName: this.admin.adminName,
        AdminSurname: this.admin.adminSurname,
        Email: this.admin.email,
        password: this.admin.user.password,
        CellPhone_Num: this.admin.cellPhone_Num,
        Role: this.admin.user.role.role_ID
      });
    })
  }



  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewAdmin');
  }

  onSubmit() {
    this.adm.AdminName = this.myForm.get('AdminName')?.value;
    this.adm.AdminSurname = this.myForm.get('AdminSurname')?.value;
    this.adm.CellPhone_Num = this.myForm.get('CellPhone_Num')?.value;
    this.adm.Email = this.myForm.get('Email')?.value;

    var cel = this.myForm.get('CellPhone_Num')?.value;
    var name = this.myForm.get('AdminName')?.value;
    var surname = this.myForm.get('AdminSurname')?.value;
    var ts = name.concat(surname);
    var username = ts.concat(cel.toString().substring(0, 3));


    this.usr.Username = username;
    this.usr.Password = this.myForm.get('password')?.value;
    this.usr.Role_ID = this.myForm.get('Role')?.value;


    this.dataService.EditUser(this.usr, this.route.snapshot.params['uid']).subscribe(result => {
      this.dataService.EditAdmin(this.adm, this.route.snapshot.params['uid']).subscribe(r => {
        this.router.navigate(['ViewAdmin'])
      })
    })
  }
}
