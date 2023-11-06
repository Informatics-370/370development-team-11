import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Help } from 'src/app/Shared/Help';
import { Help_Category } from 'src/app/Shared/HelpCategory';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { AuditLog } from '../../Shared/AuditLog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-help',
  templateUrl: './edit-help.component.html',
  styleUrls: ['./edit-help.component.css']
})
export class EditHelpComponent implements OnInit{

  myForm: FormGroup = new FormGroup({});
 help:any;
 help_Categorys:any;
 helpID:number;

 
  constructor(private router: Router,private route: ActivatedRoute, private formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  


  HelpCategory: Help_Category = {
    help_Category_ID: 0,
    name: '',
    description: ''
  }

  HelpToEdit: any ={
    help_ID: 0,
    help_Category_ID:0,
    help_Category: this.HelpCategory,
    name:'',
    video:'',
    description:'',
    user_Manual:''
  }

  log: AuditLog = {
    log_ID: 0,
    user: "",
    action: "",
    actionTime: new Date(),
  }

  ngOnInit():void {

    this.GetHelpCategorys();
    
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      //video: ['', Validators.required],
      //user_Manual: ['', Validators.required],
      help_Category_ID: ['', [Validators.required]]
    })

    this.getHelp();
    
  }

  getHelp() {
    this.dataService.GetHelp(+this.route.snapshot.params['help_ID']).subscribe(r => {
      this.help = r;
      this.myForm.patchValue({
        name: this.help.name,
        //video: this.help.video,
        description: this.help.description,
        //user_Manual: this.help.user_Manual,
        help_Category_ID: this.help.help_Category_ID
      });

      this.helpID = this.help.help_ID;
      this.HelpToEdit.help_Category_ID = this.help.help_Category_ID;
      this.HelpToEdit.name = this.help.name;
      this.HelpToEdit.video = this.help.video;
      this.HelpToEdit.description = this.help.description;
      this.HelpToEdit.user_Manual = this.help.user_Manual;
    })
  }

  GetHelpCategorys() {
    this.dataService.GetHelpCategorys().subscribe(result => {
      this.help_Categorys = result;
    });
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


  onSubmit() {
    
    this.HelpToEdit.name = this.myForm.get('name')?.value;
    var name = "" + this.HelpToEdit.name;
    this.HelpToEdit.help_Category_ID = this.myForm.get('help_Category_ID')?.value;

    
    document.getElementById('loading').style.display = 'block';
    document.querySelector('button').disabled;
    this.myForm.disabled;



    if (this.ManualFiles[0] == "" && this.Videofiles[0] == "") {  // no new Video or PDF
      this.HelpToEdit.name = this.myForm.get('name')?.value;
      this.HelpToEdit.description = this.myForm.get('description')?.value;

     
      this.dataService.EditHelpValidation(name, this.help.help_ID).subscribe({
        next: (result) => {
          console.log(result)
          if (result == null){

         
            this.dataService.EditHelp(this.HelpToEdit, this.helpID).subscribe({
              next: (response) => {

                if (response) {
                  hideloader();
                  document.getElementById('AnimationBtn').classList.toggle("is_active");
                  document.getElementById('cBtn').style.display = "none";
                }

                this.log.action = "Edited Help: " + this.HelpToEdit.name;
                this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                let test: any
                test = new DatePipe('en-ZA');
                this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                this.dataService.AuditLogAdd(this.log).subscribe({
                  next: (Log) => {
                    var action = "EDIT";
                    var title = "EDIT SUCCESSFUL";
                    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + name + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                      disableClose: true,
                      data: { action, title, message }
                    });

                    const duration = 1750;
                    setTimeout(() => {
                      this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
                      dialogRef.close();
                    }, duration);
                  }
                }) 
              }
            })
          } else{
            hideloader();
            document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
              var action = "ERROR";
              var title = "ERROR: Help Exists";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help name <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
               disableClose: true,
               data: { action, title, message }
              });

              const duration = 1750;
               setTimeout(() => {
               dialogRef.close();
              }, duration);

              function hideloader() {
                document.getElementById('loading')
               .style.display = 'none';
              }
             }
            }
          })
    } else if(this.Videofiles[0] != "" && this.ManualFiles[0] == ""){   // only new Video is added

      this.fileToUpload = this.Videofiles[0];    

      if(this.fileToUpload != null){
        let sFile = this.HelpToEdit.video;
        let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
        let HelpName = Stringtouse.substring(Stringtouse.indexOf("/") + 1, Stringtouse.lastIndexOf("/"))
        let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length) 
        this.dataService.DeleteHelpFile(HelpName,filename).subscribe( r =>{
          let HelpName: string = name
          let file: File = this.fileToUpload
 
      
        this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
          let Path: any = response
          this.sPath=Path.url.toString()
          this.HelpToEdit.video = this.sPath;

          this.dataService.EditHelpValidation(name, this.help.help_ID).subscribe({
            next: (result) => {
              if (result == null){

              
                this.dataService.EditHelp(this.HelpToEdit, this.helpID).subscribe({
                  next: (response) => {
                    document.getElementById('AnimationBtn').classList.toggle("is_active");
                    document.getElementById('cBtn').style.display = "none";
                    this.log.action = "Edited Help for: " + this.HelpToEdit.name;
                    this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                    let test: any
                    test = new DatePipe('en-ZA');
                    this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                    this.dataService.AuditLogAdd(this.log).subscribe({
                      next: (Log) => {
                        var action = "EDIT";
                        var title = "EDIT SUCCESSFUL";
                        var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + name + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                        const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                          disableClose: true,
                          data: { action, title, message }
                        });

                        const duration = 1750;
                        setTimeout(() => {
                          this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
                          dialogRef.close();
                        }, duration);
                      }
                    }) 
                   }
                   })

            }else{
                hideloader();
                document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
              var action = "ERROR";
              var title = "ERROR: Help Exists";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help name <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
               disableClose: true,
               data: { action, title, message }
              });

              const duration = 1750;
               setTimeout(() => {
               dialogRef.close();
              }, duration);

              function hideloader() {
                document.getElementById('loading')
               .style.display = 'none';
              }
            }
            }
            })
      })
      })
      }

    } else if(this.ManualFiles[0] != "" && this.Videofiles[0] == "") {  // only new PDF is added

      this.fileToUpload = this.ManualFiles[0];  

      if(this.fileToUpload != null){
        let vFile = this.HelpToEdit.user_Manual;
        let Stringtouse = vFile.substring(vFile.indexOf("procionfiles/") + 13, vFile.length)
        let HelpName = Stringtouse.substring(Stringtouse.indexOf("/") + 1, Stringtouse.lastIndexOf("/"))
        let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
       this.dataService.DeleteHelpFile(HelpName, filename).subscribe( r =>{
         let HelpName: string = name
         let file: File = this.fileToUpload

       
        

        this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
            let Path: any = response
            this.sPath=Path.url.toString()
            this.HelpToEdit.user_Manual = this.sPath;

        this.dataService.EditHelpValidation(name, this.help.help_ID).subscribe({
          next: (result) =>{
            if (result == null){

           

              this.dataService.EditHelp(this.HelpToEdit, this.helpID).subscribe({
                next: (response) => {
                  document.getElementById('AnimationBtn').classList.toggle("is_active");
                  document.getElementById('cBtn').style.display = "none";
                  this.log.action = "Edited Help for: " + this.HelpToEdit.name;
                  this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                  let test: any
                  test = new DatePipe('en-ZA');
                  this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                  this.dataService.AuditLogAdd(this.log).subscribe({
                    next: (Log) => {
                      var action = "EDIT";
                      var title = "EDIT SUCCESSFUL";
                      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + name + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                        disableClose: true,
                        data: { action, title, message }
                      });

                      const duration = 1750;
                      setTimeout(() => {
                        this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
                        dialogRef.close();
                      }, duration);
                    }
                  }) 
                   }
                   })

            }else{
              hideloader();
              document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
              var action = "ERROR";
              var title = "ERROR: Help Exists";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help name <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
               disableClose: true,
               data: { action, title, message }
              });

              const duration = 1750;
               setTimeout(() => {
               dialogRef.close();
              }, duration);

              function hideloader() {
                document.getElementById('loading')
               .style.display = 'none';
              }
            }
          }
        })
 
 
       })
       })
      }
    

    } else if(this.ManualFiles[0] != "" && this.Videofiles[0] != ""){     // New Video and PDF
      
        this.fileToUpload = this.ManualFiles[0];
        
       if(this.fileToUpload != null){
         let sFile = this.HelpToEdit.user_Manual;
         let Stringtouse = sFile.substring(sFile.indexOf("procionfiles/") + 13, sFile.length)
         let HelpName = Stringtouse.substring(Stringtouse.indexOf("/") + 1, Stringtouse.lastIndexOf("/"))
         let filename = Stringtouse.substring(Stringtouse.lastIndexOf("/") + 1, Stringtouse.length)
        this.dataService.DeleteHelpFile(HelpName,filename).subscribe( r =>{
          let HelpName: string = name
          let file: File = this.fileToUpload

        this.dataService.HelpFileAdd(HelpName,file).subscribe(response =>{
            let Path: any = response
            this.sPath=Path.url.toString()
            this.HelpToEdit.user_Manual = this.sPath;


            this.fileToUpload = this.Videofiles[0];    
       if(this.fileToUpload != null){
         let vFile = this.HelpToEdit.video;
         let vStringtouse = vFile.substring(vFile.indexOf("procionfiles/") + 13, vFile.length)
         let vHelpName = vStringtouse.substring(vStringtouse.indexOf("/") + 1, vStringtouse.lastIndexOf("/"))
         let vfilename = vStringtouse.substring(vStringtouse.lastIndexOf("/") + 1, vStringtouse.length)
        this.dataService.DeleteHelpFile(vHelpName, vfilename).subscribe( r =>{
          let vHelpName: string = name
          let file: File = this.fileToUpload

        this.dataService.HelpFileAdd(vHelpName,file).subscribe(response =>{
            let Path: any = response
            this.sPath=Path.url.toString()
            this.HelpToEdit.video = this.sPath;



              this.dataService.EditHelpValidation(name, this.help.help_ID).subscribe({
                next: (result) =>{
                  if (result == null){

                 
              this.dataService.EditHelp(this.HelpToEdit, this.helpID).subscribe({
                next: (response) => {

                  if (response) {
                    hideloader();
                    document.getElementById('AnimationBtn').classList.toggle("is_active");
                    document.getElementById('cBtn').style.display = "none";
                  }


                  this.log.action = "Edited Help for: " + this.HelpToEdit.name;
                  this.log.user = this.dataService.decodeUser(sessionStorage.getItem("token"));
                  let test: any
                  test = new DatePipe('en-ZA');
                  this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
                  this.dataService.AuditLogAdd(this.log).subscribe({
                    next: (Log) => {
                      var action = "EDIT";
                      var title = "EDIT SUCCESSFUL";
                      var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help <strong>" + name + "</strong> has been <strong style='color:green'> EDITED </strong> successfully!");

                      const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
                        disableClose: true,
                        data: { action, title, message }
                      });

                      const duration = 1750;
                      setTimeout(() => {
                        this.router.navigate(['/ViewHelp'], { queryParams: { refresh: true } });
                        dialogRef.close();
                      }, duration);
                    }
                  }) 
                }
              })

              } else{
                    hideloader();
                    document.getElementById('AnimationBtn').setAttribute('disabled', 'false');
              var action = "ERROR";
              var title = "ERROR: Help Exists";
              var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("The Help name <strong>" + name + " <strong style='color:red'>ALREADY EXISTS!</strong>");

              const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
               disableClose: true,
               data: { action, title, message }
              });

              const duration = 1750;
               setTimeout(() => {
               dialogRef.close();
              }, duration);

              function hideloader() {
                document.getElementById('loading')
               .style.display = 'none';
              }
              }
             }
            })


          })
          })
          }


      })
      })
      }
    }
        
      
            
   
       
     function hideloader() {
      document.getElementById('loading')
        .style.display = 'none';
    }
  }
} 


