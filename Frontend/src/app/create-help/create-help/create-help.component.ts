import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { DataService } from 'src/app/DataService/data-service';
import { Help } from 'src/app/Shared/Help';
import { Help_Category } from 'src/app/Shared/HelpCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-help',
  templateUrl: './create-help.component.html',
  styleUrls: ['./create-help.component.css']
})
export class CreateHelpComponent implements OnInit{
  myForm: FormGroup = new FormGroup({});
 
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

 help_Categorys: any[] =[];
 helpID:any;  

  HelpCategory: Help_Category = {
    help_Category_ID: 0,
    name: '',
    description: ''
  }

  Help: Help ={
    help_ID: 0,
    help_Category_ID:0,
    help_Category: this.HelpCategory,
    name:'',
    video:'',
    description:'',
    user_Manual:'',
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  ngOnInit() {

    this.GetHelpCategorys();
  

    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      video: ['', Validators.required],
      user_Manual: ['', Validators.required],
      help_Category_ID: ['', [Validators.required]]
     
    })
  }

  GetHelpCategorys() {
    this.dataService.GetHelpCategorys().subscribe(result => {
      this.help_Categorys = result;
      console.log(this.help_Categorys)
    });
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

    this.HelpCategory = this.myForm.get('help_Category_ID')?.value;
    this.HelpCategory.help_Category_ID = 0;
    this.Help.name = this.myForm.get('name')?.value;
    var name = this.Help.name;
    this.Help.description = this.myForm.get('description')?.value;
    this.Help.help_Category = this.HelpCategory;
  
   

   document.getElementById('loading').style.display = 'block';
   document.querySelector('button').disabled;
   this.myForm.disabled;

 
    this.fileToUpload = this.ManualFiles[0];
    if(this.fileToUpload != null){
      let HelpName: string = this.myForm.get('name')?.value;
      let file: File = this.fileToUpload
      this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
         let Path: any = response
         this.sPath=Path.pathSaved.toString()
         this.Help.user_Manual = this.sPath;
         console.log(this.Help.user_Manual)


         this.fileToUpload = this.Videofiles[0];
          if(this.fileToUpload != null){
            let HelpName: string = this.myForm.get('name')?.value;
            let file: File = this.fileToUpload
            this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
              let Path: any = response
              this.sPath=Path.pathSaved.toString()
              this.Help.video = this.sPath;
              console.log(this.Help.video)




            this.dataService.HelpValidation(name).subscribe({
              next: (result) => {
                if( result ==null){

              
               
                      this.dataService.AddHelps(this.Help).subscribe({
                        next: (response) => {

                          if (response) {
                            hideloader();
                            document.getElementById('cBtn').style.display = "none";
                            document.querySelector('button').classList.toggle("is_active");
                          }

                          this.log.action = "Created Help: " + this.Help.name;
                          this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                          let test: any
                          test = new DatePipe('en-ZA');
                          this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                          this.dataService.AuditLogAdd(this.log).subscribe({
                            next: (Log) => {
                              var action = "Create";
                              var title = "CREATE SUCCESSFUL";
                              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help name <strong>" + name + "</strong> has been <strong style='color:green'> CREATED </strong> successfully!");
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
                      })
                    }else{
                      elsehideloader();
                       var action = "ERROR";
                       var title = "ERROR: Help Exists";
                       var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

                       const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                       disableClose: true,
                       data: { action, title, message }
                       });

                       const duration = 1750;
                       setTimeout(() => {
                       dialogRef.close();
                       }, duration);

                       function elsehideloader() {
                        document.getElementById('loading')
                          .style.display = 'none';
                      }
                    }
                  }
                })




                      function hideloader() {
                        document.getElementById('loading')
                          .style.display = 'none';
                      }
            })
          }
      })
    }
    


 
    
    
  }
}
