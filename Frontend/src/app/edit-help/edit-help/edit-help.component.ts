import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Help } from 'src/app/Shared/Help';
import { HelpCategory } from 'src/app/Shared/HelpCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';

@Component({
  selector: 'app-edit-help',
  templateUrl: './edit-help.component.html',
  styleUrls: ['./edit-help.component.css']
})
export class EditHelpComponent implements OnInit{

  myForm: FormGroup = new FormGroup({});
  displayedColumns: string[] = ['name', 'description', 'video', 'user_Manual', 'helpCategory', 'action', 'delete'];
  constructor(private router: Router,private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

helpCategoryArray: HelpCategory[]=[];


HelpCategory: HelpCategory = {
    help_Category_ID: 0,
    name: '',
    description: ''
  }

  HelpToEdit: Help ={
    help_ID: 0,
    help_Category_ID:0,
    helpCategory: this.HelpCategory,
    name:'',
    video:'',
    description:'',
    user_Manual:''
  }


  ngOnInit():void {

    this.GetHelpCategorys();
  

    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      video: ['', Validators.required],
      user_Manual: ['', Validators.required],
      HelpCategory: ['', [Validators.required]]
      //help_Category_ID: ['', [Validators.required]]
    })
/*
    this.route.paramMap.subscribe({
      next: (paramater) => {
        const id = paramater.get("help_ID");
        console.log(id)

        if (id) {
          this.dataService.GetHelp(Number(id)).subscribe({
            next: (HelpRecieved) => {
              this.HelpToEdit = HelpRecieved

              const CategoryID = Number(this.HelpToEdit.help_Category_ID);
              const CategoryIndex = this.helpCategoryArray.findIndex((category) => category.help_Category_ID === CategoryID);

              this.myForm.get('HelpCategory')?.setValue(this.helpCategoryArray[CategoryIndex].name);
            }
          })
        }
      }
    })
*/
    
  }

  GetHelpCategorys() {
    this.dataService.GetHelpCategorys().subscribe(result => {
      let HelpCategoryList: any[] = result
      HelpCategoryList.forEach((element) => {
        this.helpCategoryArray.push(element)
        console.log(element)
      })
    })
  }




  fileToUpload: File | null = null;
  Videofiles: any[] = [''];
  ManualFiles: any[] = [''];
  sPath ="";

  onPDFFileUpload(event: any) {
    this.fileToUpload = event.target.files[0];

    if (this.fileToUpload != null) {
          this.ManualFiles[0] = this.fileToUpload;
    }
  }

  onVideoFileUpload(event: any) {
    this.fileToUpload = event.target.files[0];

    if (this.fileToUpload != null) {
          this.Videofiles[0] = this.fileToUpload;
    }
  }




  get f() {
    return this.myForm.controls;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.myForm.controls[controlName].hasError(errorName);
  }

  Close() {
    this.myForm.reset();
    this.router.navigateByUrl('ViewHelp');
  }


  onSubmit() {

    this.fileToUpload = this.ManualFiles[0];
    if(this.fileToUpload != null){
      let HelpName: string = this.myForm.get('name')?.value;
      let file: File = this.fileToUpload
      this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
         let Path: any = response
         this.sPath=Path.pathSaved.toString()
         this.HelpToEdit.user_Manual = this.sPath;
         console.log(this.HelpToEdit.user_Manual)
      })
    }
    this.fileToUpload = this.Videofiles[0];
    if(this.fileToUpload != null){
      let HelpName: string = this.myForm.get('name')?.value;
      let file: File = this.fileToUpload
      this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
         let Path: any = response
         this.sPath=Path.pathSaved.toString()
         this.HelpToEdit.video = this.sPath;
         console.log(this.HelpToEdit.video)
      })
    }

   this.HelpCategory.name = this.myForm.get('HelpCategory')?.value;
    this.HelpToEdit.name = this.myForm.get('name')?.value;
    this.HelpToEdit.description = this.myForm.get('description')?.value;
    this.HelpToEdit.helpCategory = this.HelpCategory;


    this.dataService.HelpValidation(this.HelpToEdit.name, this.HelpToEdit.helpCategory.name).subscribe({
      next: (Result) => {
        if (Result == null) {
          this.dataService.EditHelp(this.HelpToEdit.help_ID, this.HelpToEdit).subscribe({
            next: (response) => {

              if (response) {
                document.getElementById('cBtn').style.display = "none";
                document.querySelector('button').classList.toggle("is_active");
              }

              var action = "Create";
              var title = "CREATED SUCCESSFUL";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + this.HelpToEdit.name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                disableClose: true,
                data: { action, title, message }
              });

              const duration = 1750;
              setTimeout(() => {
                this.router.navigate(['/ViewHelp']);
                dialogRef.close();
              }, duration);
            }
          })
        }
        else {
          var action = "ERROR";
          var title = "ERROR: Help Exists";
          var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + this.HelpToEdit.name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

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
