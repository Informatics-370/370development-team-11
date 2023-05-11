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
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) { }

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
    this.dataService.EditDepartment(this.Department.department_ID, this.myForm.value).subscribe(result => {
      this.router.navigate(['ViewDepartment'])
    })
  }

}
