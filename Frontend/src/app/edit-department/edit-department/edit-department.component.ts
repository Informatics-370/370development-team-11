import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { DataService } from 'src/app/DataService/data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/Shared/Department';
import { MatDialog } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit{
  public myForm !: FormGroup;

  Department:any
 
  DepartmentToEdit:any  = {
    department_ID :0,
    name:'',
    description:'',
  }
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+"),]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")])
    });

    this.dataService.GetDepartment(+this.route.snapshot.params['department_ID']).subscribe(result => {
      this.Department = result
      console.log(result)
      this.myForm.patchValue({
        name: this.Department.name,
        description: this.Department.description
      });
    })
  }
  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewDepartment');
  }

  onSubmit() {
    var name = this.myForm.get('name')?.value;

    this.dataService.EditDepartment(this.Department.department_ID, this.myForm.value).subscribe({
      next: (response) => {
        var action = "Update";
        var title = "UPDATE SUCCESSFUL";
        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Department <strong>" + name + "</strong> has been <strong style='color:green'> UPDATED </strong> successfully!");

        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
          disableClose: true,
          data: { action, title, message }
        });

        const duration = 1750;
        setTimeout(() => {
          this.router.navigate(['/ViewDepartment']);
          dialogRef.close();
        }, duration);
      }
    })




  }


 
}
