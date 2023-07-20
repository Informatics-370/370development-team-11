import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../Shared/EmployeeRole';
import { DataService } from '../DataService/data-service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from '../notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-employee-role',
  templateUrl: './create-employee-role.component.html',
  styleUrls: ['./create-employee-role.component.css']
})
export class CreateEmployeeRoleComponent implements OnInit {
  public myForm !: FormGroup;
  constructor(private router: Router, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }



  ngOnInit() {
    this.myForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 -]+"),]),
      Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z0-9][a-zA-Z0-9 ]+")])
    });
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewEmpRole');
  }

  onSubmit() {

    var name = this.myForm.get('Name')?.value;

    this.dataService.CreateRoleValidation(name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.AddRole(this.myForm.value).subscribe({
            next: (response) => {
              document.getElementById('cBtn').style.display = "none";
              document.querySelector('button').classList.toggle("is_active");
              
              var action = "Create";
              var title = "CREATE SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The role <strong>" + name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/ViewEmpRole']);
                dialogRef.close();
              }, duration);
            }
          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: User Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The role <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

          const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
            disableClose: true,
            data: { action, title, message }
          });

          const duration = 1750;
          setTimeout(() => {
            dialogRef.close();
          }, duration);
        }
      }
    })


  }

}
