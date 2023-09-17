import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnboardRequest } from 'src/app/Shared/OnboardRequest';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { Role } from 'src/app/Shared/EmployeeRole';
import { User } from 'src/app/Shared/User';
import { VendorStatus } from 'src/app/Shared/VendorStatus';
import { HttpClient } from '@angular/common/http';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Onboard_Status } from 'src/app/Shared/OnboardStatus';
import { SoleSupplier } from 'src/app/Shared/Sole_Supplier';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationdisplayComponent } from 'src/app/notificationdisplay/notificationdisplay.component';
import { Notification } from 'src/app/Shared/Notification';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Due_Dillegence } from 'src/app/Shared/DueDillegence';
import { POPI } from 'src/app/Shared/POPI';
import { DatePipe } from '@angular/common';
import { Notification_Type } from 'src/app/Shared/Notification_Type';
import { Access } from 'src/app/Shared/Access';

pdfMake.vfs = pdfFonts.pdfMake.vfs;




import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};
@Component({
  selector: 'app-vendor-approve',
  templateUrl: './vendor-approve.component.html',
  styleUrls: ['./vendor-approve.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class VendorApproveComponent implements OnInit {

  rl: Role = {
    role_ID: 0,
    name: '',
    description: ''
  }

  Access: Access = {
    Access_ID: 0,
    IsAdmin: '',
    CanAccInv: '',
    CanAccFin: '',
    CanAccPro: '',
    CanAccVen: '',
    CanAccRep: '',
    CanViewPenPro: '',
    CanViewFlagPro: '',
    CanViewFinPro: '',
    CanAppVen: '',
    CanEditVen: '',
    CanDeleteVen: '',
  }

  usr: User = {
    user_Id: 0,
    role_ID: 0,
    access_ID: 0,
    access: this.Access,
    username: '',
    password: '',
    profile_Picture: './assets/Images/Default_Profile.jpg',
    no_Notifications: 0,
    role: this.rl
  }


  Notification_Type: Notification_Type = {
    notification_Type_ID: 0,
    name: "",
    description: "",
  }

  VendorNotification: Notification = {
    notification_ID: 0,
    notification_Type_ID: 0,
    user_ID: 0,
    name: "",
    send_Date: new Date(),
    user: this.usr,
    notification_Type: this.Notification_Type,
  };



  vendorsRequest: VendorOnboardRequest[] = [];
  onboardRequest: OnboardRequest[] = [];
  onboardRequestSelectedData: OnboardRequest;
  selectedIndex = 0;
  VendorType: boolean = true;
  FileDetails: any[] = [];
  panelOpenState = false;

  rows: FormArray = this._formBuilder.array([]);
  CompanyContactInfoFormGroup: FormGroup = this._formBuilder.group({ 'RequestData': this.rows });


  SoleSupplierFormGroup = this._formBuilder.group({
    VendorID: 0,
    CompanyName: '',
    CompanyEmail: '',
    Reason: '',
    CompanyQuote: ''
  })

  ViewFormGroup = this._formBuilder.group({
    VendorID: 0,
    CompanyName: '',
    CompanyEmail: '',
    Reason: '',
    CompanyQuote: ''
  })


  fileToUpload: File | null = null;
  files: File[] = [];

  selectedOption: string = "True";
  matcher = new MyErrorStateMatcher()
  Urls: any[] = [];
  constructor(private _formBuilder: FormBuilder, private dataService: DataService, private router: Router, private ActRoute: ActivatedRoute, private http: HttpClient, private dialog: MatDialog, private sanitizer: DomSanitizer) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  //@ViewChild(MatAccordion) accordion: Matac;


  DueDilligenceDetails: Due_Dillegence;
  POPIDetails: POPI;
  BEEbool = false;

  ngOnInit() {
    this.convertLogoToBase64()
    var User = this.dataService.decodeUser(sessionStorage.getItem('token'))
    this.dataService.GetUserByUsername(User).subscribe(response => {
      this.usr = response
      this.usr.access = response.access
      this.VendorNotification.user.access = response.access
    })

    this.vendorsRequest = []
    this.onboardRequest = [];
    this.FileDetails = [];
    this.files = [];
    this.onboardRequestSelectedData = undefined
    this.rows.reset()
    this.rows = this._formBuilder.array([]);
    this.CompanyContactInfoFormGroup.reset()
    this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });


    this.SoleSupplierFormGroup = this._formBuilder.group({
      VendorID: 0,
      CompanyName: '',
      CompanyEmail: '',
      Reason: '',
      CompanyQuote: ''
    })

    this.ViewFormGroup = this._formBuilder.group({
      VendorID: 0,
      CompanyName: '',
      CompanyEmail: '',
      Reason: '',
      CompanyQuote: ''
    })

    this.convertImageToBase64('./assets/Images/CheckMarkBox.png')
    this.convertImageToBase64('./assets/Images/checkboxEmpty.png')
    const row = this._formBuilder.group({
      tab: [this.onboardRequest.length],
      VendorID: 0,
      CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
      CompanyQuote: '',
      PrefferedVendor: [false],
    });
    this.rows.push(row);
    // this.fileToUpload = this.files[0]
    //   {{onboardRequest[0]}}
    this.ActRoute.paramMap.subscribe({
      next: (paramater) => {

        let RequestID = paramater.get("RequestNo");
        this.dataService.GetRequestByID(Number(RequestID)).subscribe(result => {
          let RequestList: any[] = []
          RequestList = result
          RequestList.forEach((element) => {
            this.onboardRequest.push(element)
            this.ViewOnboardRequest()
            const row = this._formBuilder.group({
              tab: [this.onboardRequest.length],
              VendorID: 0,
              CompanyName: ['', [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z\s]*$/)]],
              CompanyEmail: ['', [Validators.required, Validators.maxLength(32), Validators.email]],
              CompanyQuote: '',
              PrefferedVendor: [false],
            });
            this.rows.push(row);
            this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });

          })
          this.rows.removeAt(1);
          //this.CompanyContactInfoFormGroup = this._formBuilder.group({ 'RequestData': this.rows });
          if (RequestList.length > 1) {
            for (let i = 0; i < this.CompanyContactInfoFormGroup.controls.RequestData.value.length; i++) {
              this.FileDetails.push({ FileURL: "", FileName: "" })
              this.rows.controls[i].get('VendorID')?.setValue(this.onboardRequest[i].vendor_ID)
              this.rows.controls[i].get('CompanyName')?.setValue(this.onboardRequest[i].vendor.name);
              this.rows.controls[i].get('CompanyEmail')?.setValue(this.onboardRequest[i].vendor.email);
              this.rows.controls[i].get('PrefferedVendor')?.setValue(this.onboardRequest[i].vendor.preferedVendor);
              this.rows.controls[i].get('PrefferedVendor')?.disable()
              let sFile = this.onboardRequest[i].quotes;
              let RequestNo = sFile.substring(0, sFile.indexOf("\\"))
              let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
              this.FileDetails[i].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
              this.FileDetails[i].FileName = filename;
              this.files.push(this.fileToUpload);
              this.dataService.GetOnboardFiles(RequestNo, filename).subscribe(result => {
                this.files[i] = result
              })

            }

            if (RequestList.length < 2) {
              this.VendorType = false;
            }
            else {
              this.VendorType = true;
            }
            this.setActiveTab()
          }
          else {
            this.FileDetails.push({ FileURL: "", FileName: "" })
            this.SoleSupplierFormGroup.get('VendorID')?.setValue(this.onboardRequest[0].vendor_ID)
            this.SoleSupplierFormGroup.get('CompanyName')?.setValue(this.onboardRequest[0].vendor.name);
            this.SoleSupplierFormGroup.get('CompanyEmail')?.setValue(this.onboardRequest[0].vendor.email);
            this.dataService.GetSoleSupplierByID(RequestList[0].vendor_ID).subscribe(result => {
              this.SoleSupplierFormGroup.get('Reason')?.setValue(result.reason);
            })
            if (this.onboardRequest[0].quotes != "None") {
              let sFile = this.onboardRequest[0].quotes;
              let RequestNo = sFile.substring(0, sFile.indexOf("\\"))
              let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
              this.FileDetails[0].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
              this.FileDetails[0].FileName = filename;
              this.files.push(this.fileToUpload);
              this.dataService.GetOnboardFiles(RequestNo, filename).subscribe(result => {
                this.files[0] = result
              })
            }
            // this.dataService.GetDueDiligence(RequestList[0].vendor_ID).subscribe(result => {
            //   this.BEEbool = result.B_BBEE_Certificate_Provided

            // })

          }

          //if(this.onboardRequest.length > 1 && this.onboardRequest[0].status_ID == 5)

        })
      }
    });
  }//ngOnInit

  setActiveTab() {
    this.selectedIndex = 0;
  }
  fileUrl: SafeResourceUrl[] = [];
  fileType: string;
  onFileUpload(i: number, event: any) {




    // this.fileToUpload = event.target.files[0];

    //this.fileToUpload = file
    this.openPDFInNewTab(i);
  }


  openPDFInNewTab(i: number): void {
    const url = this.FileDetails[i].FileURL;
    this.http.get(url, { responseType: 'blob' }).subscribe(response => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    });
    // window.open(url, '_blank');
  }




  QuoteChecked = false;

  onQuoteChecked() {
    if (this.QuoteChecked == false) {
      this.QuoteChecked = true;
    }
    else if (this.QuoteChecked == true) {
      this.QuoteChecked = false;
    }


  }

  ChangesVendorRequestStatus(i: number) {

    for (let a = 0; a < this.onboardRequest.length; a++) {
      if (this.onboardRequest[a].vendor_ID == i) {
        this.dataService.ChangeVendorStatus(1, this.onboardRequest[a].vendor_ID).subscribe()
      }
      else {
        this.dataService.ChangeVendorStatus(1, this.onboardRequest[a].vendor_ID).subscribe()
      }

    }
    // this.router.navigate(['/vendor-approved-add-details/' + i])
  }

  UpdateOnboardRequestStatus(i: number) {

    let Changeable = true;
    for (let a = 0; a < this.onboardRequest.length; a++) {

      if (this.onboardRequest[a].vendor.vendor_Status_ID != 5 && this.onboardRequest[a].vendor_ID != i) {

        Changeable = false;

      }
    }
    if (Changeable == true) {
      this.ChangesVendorRequestStatus(i)
      for (let a = 0; a < this.onboardRequest.length; a++) {
        if (this.onboardRequest[a].status_ID != 1) {

          this.dataService.ChangeOnboardStatus(5, this.onboardRequest[a].onboard_Request_Id, this.onboardRequest[a].vendor_ID).subscribe(next => {
            this.router.navigate(['/vendor-approve/' + this.onboardRequest[0].onboard_Request_Id])
            this.ngOnInit();
          })
        }

      }
      // this.router.navigate(['/vendor-unofficial-vendorlist'])
      //window.location.reload()
      //this.router.navigate(['/vendor-approve/' + this.onboardRequest[0].onboard_Request_Id])
    }


  }


  ReturnOnboardRequestStatus() {
    if (this.onboardRequest.length > 1) {
      for (let a = 0; a < this.onboardRequest.length; a++) {
        if (this.onboardRequest[a].status_ID != 1) {
          this.dataService.ChangeOnboardStatus(1, this.onboardRequest[a].onboard_Request_Id, this.onboardRequest[a].vendor_ID).subscribe()
        }
      }
    }
    else if (this.onboardRequest.length == 1) {
      this.dataService.ChangeOnboardStatus(4, this.onboardRequest[0].onboard_Request_Id, this.onboardRequest[0].vendor_ID).subscribe()
    }

    this.router.navigate(['/vendor-unofficial-vendorlist'])
  }

  RejectRequest() {
    for (let a = 0; a < this.onboardRequest.length; a++) {
      this.dataService.ChangeOnboardStatus(2, this.onboardRequest[a].onboard_Request_Id, this.onboardRequest[a].vendor_ID).subscribe()
      this.dataService.ChangeVendorStatus(5, this.onboardRequest[a].vendor_ID).subscribe()
    }
    this.VendorNotification.notification_Type_ID = 6;
    let transVar: any
    transVar = new DatePipe('en-ZA');
    this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
    this.VendorNotification.name = "Request #" + this.onboardRequest[0].onboard_Request_Id + " Has been Rejected"
    this.VendorNotification.user_ID = this.onboardRequest[0].user_Id;
    this.dataService.VendorAddNotification(this.VendorNotification).subscribe();
    var action = "REJECTED";
    var title = "REJECTION SUCCESSFUL";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully <strong style='color:red'> REJECTED </strong> onboard request # <strong>" + this.onboardRequest[0].onboard_Request_Id + "</strong>.");

    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
      disableClose: true,
      data: { action, title, message }
    });

    const duration = 2000;
    setTimeout(() => {
      //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
      this.router.navigate(['/vendor-unofficial-vendorlist'])
      dialogRef.close();
    }, duration);

  }

  Delete(i: number) {
    for (let a = 0; a < this.onboardRequest.length; a++) {
      this.dataService.ChangeOnboardStatus(2, this.onboardRequest[a].onboard_Request_Id, this.onboardRequest[a].vendor_ID).subscribe()
      if (this.onboardRequest[a].vendor_ID == i) {
        this.dataService.ChangeVendorStatus(5, this.onboardRequest[a].vendor_ID).subscribe()
      }
    }
    this.dataService.GetDueDiligence(Number(i)).subscribe(element => {

      if (element.b_BBEE_Certificate_Provided == true) {
        this.dataService.GetBEEDetails(i).subscribe(response => {

          this.dataService.DeleteBEEDetails(response.beE_ID).subscribe()
          let sFile = response.beE_Certificate;
          let FolderCategory = sFile.substring(0, sFile.indexOf("\\"))
          sFile = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
          let VendorNo = sFile.substring(0, sFile.indexOf("\\"))
          let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
          this.dataService.DeleteVendorFile(FolderCategory, VendorNo, filename).subscribe()

        })
      }

      if (element.popI_Present = true) {
        this.dataService.GetPOPI(element.due_Diligence_ID).subscribe(response => {

          this.dataService.DeletePOPI(response.popI_ID).subscribe(next => {
            this.dataService.DeleteDueDiligence(element.due_Diligence_ID).subscribe()
          })
        })
      }
      else {
        this.dataService.DeleteDueDiligence(element.due_Diligence_ID).subscribe()
      }

    })
    var action = "REJECTED";
    var title = "REJECTION SUCCESSFUL";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully <strong style='color:red'> REJECTED </strong> onboard request # <strong>" + this.onboardRequest[0].onboard_Request_Id + "</strong>.");

    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
      disableClose: true,
      data: { action, title, message }
    });

    const duration = 2000;
    setTimeout(() => {
      //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
      this.router.navigate(['/vendor-unofficial-vendorlist'])
      dialogRef.close();
    }, duration);

  }

  ViewOnboardRequest() {
    for (let a = 0; a < this.onboardRequest.length; a++) {
      if (this.onboardRequest[a].vendor.vendor_Status_ID == 4 || this.onboardRequest[a].vendor.vendor_Status_ID == 3) {
        this.onboardRequestSelectedData = this.onboardRequest[a]
        this.FileDetails.push({ FileURL: "", FileName: "" })
        this.ViewFormGroup.get('VendorID')?.setValue(this.onboardRequestSelectedData.vendor_ID)
        this.ViewFormGroup.get('CompanyName')?.setValue(this.onboardRequestSelectedData.vendor.name);
        this.ViewFormGroup.get('CompanyEmail')?.setValue(this.onboardRequestSelectedData.vendor.email);

        if (this.onboardRequest.length == 1) {
          this.dataService.GetSoleSupplierByID(this.onboardRequestSelectedData.vendor_ID).subscribe(result => {
            if (result != null) {
              this.ViewFormGroup.get('Reason')?.setValue(result.reason);
            }
          })
        }
        if (this.onboardRequestSelectedData.quotes != "None") {
          let sFile = this.onboardRequestSelectedData.quotes;
          let RequestNo = sFile.substring(0, sFile.indexOf("\\"))
          let filename = sFile.substring(sFile.indexOf("\\") + 1, sFile.length)
          this.FileDetails[0].FileURL = `https://localhost:7186/api/OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`
          this.FileDetails[0].FileName = filename;
          this.files.push(this.fileToUpload);
          this.dataService.GetOnboardFiles(RequestNo, filename).subscribe(result => {
            this.files[0] = result
          })
        }
      }
    }



  }

  boxCheckedTrue: any
  boxCheckedFalse: any
  logoImageBase64:any;

  convertLogoToBase64() {
    let filePath = "./assets/Images/moyo-full-logo2.png";
    const response = fetch(filePath).then((res) => res.blob()).then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => { 
        this.logoImageBase64 = reader.result   
      };
      reader.readAsDataURL(blob);
  });
  }

  GenerateList(i: number) {

    this.dataService.GetDueDiligence(i).subscribe(result => {
      this.DueDilligenceDetails = result;
      if (this.DueDilligenceDetails.popI_Present == true) {
        this.dataService.GetPOPI(this.DueDilligenceDetails.due_Diligence_ID).subscribe(response => {
          this.POPIDetails = response;

          const docDefinition = {
            info: {
              title: `Due Dilligence Checklist for ${this.DueDilligenceDetails.vendor.name}`,
            },
            header: {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [
                  [{ image: this.logoImageBase64, alignment: 'left', fillColor: "#244688", width: 200, height: 55, margin: [5, 5, 0, 5] }, { text: "", fillColor: "#244688", alignment: 'right' }],
                ]
              },
              layout: 'noBorders',
  
            },
            content: [
              { text: 'Vendor Due Diligence Checklist', fontSize: 20, alignment: 'center', color: '#002060', margin: [0, 0, 0, 15] },
              {
                text: 'Created By: ' + this.usr.username,
                fontSize: 12,
                alignment: 'center',
                bold:true,
                decoration: 'underline',
              },
              {
                text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                fontSize: 12,
                alignment: 'center',
                bold:true,
                decoration: 'underline',
              },
              {
                canvas: [
                  // Centered line with space above
                  { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
                ],
                // Add space above the line
                margin: [0, 10]
              },
            {
              //layout: 'noBorders',
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'FOUNDATIONAL DOCUMENTS', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#70ad47' }, { text: '', fillColor: '#70ad47' }],
                [{ text: 'Mutual Non-Disclosure Agreement or Confidentiality Agreement', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.mutual_Nda_Signed), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Basic Company Information (full legal name,address, physical location, website URL, trading name)', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.basic_Company_Info_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
                [{ text: 'Ownership structure and affiliated entities (Group structure)', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.group_Structure_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Income tax number', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.income_Tax_Number_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
                [{ text: 'VAT number', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.vat_Number_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Company registration document (CIPC)', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Reg_Doc_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
                [{ text: 'Letters of good standing COID', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.letter_Of_Good_Standing_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'B-BBEE certificate', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.b_BBEE_Certificate_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
                [{ text: 'Directors details and ID', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.direcor_Details_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Company resolution authorising the counter-party to enter into an agreement with Moyo and bind the entity', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Resolution_Agreement_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'FINANCIALS', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#4472c4' }, { text: '', fillColor: '#4472c4' }],
                [{ text: 'VAT registration certificate', fillColor: '#d9e1f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.vat_Reg_Certificate_Provided), width: 10, height: 10, fillColor: '#d9e1f2' }],
                [{ text: 'Tax clearance certificate', fillColor: '#b4c6e7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.tax_Clearance_Certificate_Provided), width: 10, height: 10, fillColor: '#b4c6e7' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'SUB-CONTRACTING', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#5b9bd5' }, { text: '', fillColor: '#5b9bd5' }],
                [{ text: 'Name of sub-contractor (company or individual)', fillColor: '#ddebf7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.subcontractor_Name_Provided), width: 10, height: 10, fillColor: '#ddebf7' }],
                [{ text: 'In case of company, provide similar documents as for main supplier', fillColor: '#bdd7ee' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Details_Provided), width: 10, height: 10, fillColor: '#bdd7ee' }],
                [{ text: 'In case of individual, provide copy of ID, qualifications, accreditations and professional memberships', fillColor: '#ddebf7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.individual_Details_Provided), width: 10, height: 10, fillColor: '#ddebf7' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'INSURANCE', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#a5a5a5' }, { text: '', fillColor: '#a5a5a5' }],
                [{ text: 'General liability insurance', fillColor: '#ededed' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.general_Liability_Insurance_Present), width: 10, height: 10, fillColor: '#ededed' }],
                [{ text: 'Cyber insurance', fillColor: '#dbdbdb' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.cyber_Insurance_Present), width: 10, height: 10, fillColor: '#dbdbdb' }],
                [{ text: 'Professional indemnity insurance (if applicable)', fillColor: '#ededed' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present), width: 10, height: 10, fillColor: '#ededed' }],
                [{ text: 'Other specific insurance required per service/industry', fillColor: '#dbdbdb' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.other_Insurance_Required), width: 10, height: 10, fillColor: '#dbdbdb' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              pageBreak: 'after',
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'LICENSES OR PROFESSIONAL ACCREDITATION', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#44546a' }, { text: '', fillColor: '#44546a' }],
                [{ text: 'Licenses required - (specify and attach copies)', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.licenses_Required), width: 10, height: 10, fillColor: '#d6dce4' }],
                [{ text: 'Accreditation required - (specify and attach copies)', fillColor: '#acb9ca' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.accreditation_Required), width: 10, height: 10, fillColor: '#acb9ca' }],
                [{ text: 'Professional membership required - (specify and attach copies)', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Membership_Required), width: 10, height: 10, fillColor: '#d6dce4' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'INFORMATION SECURITY', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#375623' }, { text: '', fillColor: '#375623' }],
                [{ text: 'Business continuity plan', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.business_Continuity_Present), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Disaster recovery plan', fillColor: '#548235' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.dIsaster_Recovery_Plan_Present), width: 10, height: 10, fillColor: '#548235' }],
                [{ text: 'Protection of personal information by design (use PPI checklist)', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.popI_Present), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'History of data breaches and security incidents', fillColor: '#548235' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.data_Security_Breaches_Present), width: 10, height: 10, fillColor: '#548235' }],
                [{ text: 'Site visits to assess security controls (if required)', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.site_Visits_Present), width: 10, height: 10, fillColor: '#a9d08e' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'POLICY REVIEW', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#808080' }, { text: '', fillColor: '#808080' }],
                [{ text: 'Information security / Data protection policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.information_Security_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
                [{ text: 'Privacy policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.privacy_Policy_Present_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
                [{ text: 'Data retention and destruction policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.data_Retention_Destruction_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
                [{ text: 'Anti-bribery and anti-corruption policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.anti_Bribery_Corruption_Policy_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
                [{ text: 'Ethics policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.ethics_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
                [{ text: 'Conflict of interest policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.conflict_Of_Interest_Policy_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
                [{ text: 'Customer complaints policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.customer_Complaints_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'BUSINESS REFERENCES', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#44546a' }, { text: '', fillColor: '#44546a' }],
                [{ text: 'Details of at least two business references: Client name and address, Contact person and role in client organisation Contact number,E-mail address', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.business_References_Present), width: 10, height: 10, fillColor: '#d6dce4' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
             pageBreak: 'after',
            },
            {
              table: {
                headerRows: 0,
                widths: ['*', 'auto'],
                body: [[{ text: 'Protection of Personal Information Checklist', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#375623' }, { text: '', fillColor: '#375623' }],
                [{ text: 'Does the contract set out what personal data is used for what purpose?', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.POPIDetails.personal_Data_Purpose), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Is the contracted partner a controller (C), joint controller (JC), processor (P) or sub-processor (SP)?', fillColor: '#e2efda' }, { text: this.GetCode(this.POPIDetails.contracted_Partner_Type_ID), fillColor: '#e2efda', fontSize: 10 }],
                [{ text: 'Depending on the controller/processor relationship, do you have a Data Processing Agreement or a Joint Controller Agreement in place?', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.POPIDetails.dataProcessing_JointController_Agreement), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Does the contract highlight the importance of confidentiality?', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.POPIDetails.confidentiality_Importance_Highlighted), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Does the contract provide for audits and inspections?', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.POPIDetails.contract_Audits_Provisions_Provided), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Is it clear who is accountable and liable for different activities?', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.POPIDetails.activity_Liability_Present), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: 'Is there a provision to cover third party processing of data?', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.POPIDetails.third_Party_Data_Processing_Provisioned), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Does a process exist for managing data when the contract ends?', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.POPIDetails.contract_End_Data_Management_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
                [{ text: "Is the personal data that's being processed detailed in your and their 'Record of Processing Activities'?", fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.POPIDetails.personal_Data_Processing_Details_Present), width: 10, height: 10, fillColor: '#a9d08e' }],
                [{ text: 'Does the supplier hold any form of certification for their processing activities?', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.POPIDetails.processing_Activities_Certification_Held), width: 10, height: 10, fillColor: '#e2efda' }],]
              },
              layout: {
                hLineWidth: function (i, node) {
                  if (i === 0 || i === node.table.body.length || i === 1) {

                    return 1;
                  }
                  else {
                    return 0;
                  }

                },
                vLineWidth: function (i) {
                  if (i === 0 || i === 2) {
                    return 1;
                  }
                  else {
                    return 0
                  }

                },
                hLineColor: function (i) {
                  return i ? 'black' : '#000000'

                },
                vLineColor: function (i) {
                  return i ? 'black' : '#000000'
                },

              },
              margin: [0, 0, 0, 15],
            },
            ],
            pageMargins: [40, 80, 40, 60],


          };

          pdfMake.createPdf(docDefinition).open();
        })
      }
      else {
        const docDefinition = {
          info: {
            title: `Due Dilligence Checklist for ${this.DueDilligenceDetails.vendor.name}`,
          },
          header: {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [
                [{ image: this.logoImageBase64, alignment: 'left', fillColor: "#244688", width: 200, height: 55, margin: [5, 5, 0, 5] }, { text: "", fillColor: "#244688", alignment: 'right' }],
              ]
            },
            layout: 'noBorders',

          },
          content: [
            { text: 'Vendor Due Diligence Checklist', fontSize: 20, alignment: 'center', color: '#002060', margin: [0, 0, 0, 15] },
            {
              text: 'Created By: ' + this.usr.username,
              fontSize: 12,
              alignment: 'center',
              bold:true,
              decoration: 'underline',
            },
            {
              text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
              fontSize: 12,
              alignment: 'center',
              bold:true,
              decoration: 'underline',
            },
            {
              canvas: [
                // Centered line with space above
                { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
              ],
              // Add space above the line
              margin: [0, 10]
            },
          {

            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'FOUNDATIONAL DOCUMENTS', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#70ad47' }, { text: '', fillColor: '#70ad47' }],
              [{ text: 'Mutual Non-Disclosure Agreement or Confidentiality Agreement', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.mutual_Nda_Signed), width: 10, height: 10, fillColor: '#e2efda' }],
              [{ text: 'Basic Company Information (full legal name,address, physical location, website URL, trading name)', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.basic_Company_Info_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
              [{ text: 'Ownership structure and affiliated entities (Group structure)', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.group_Structure_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
              [{ text: 'Income tax number', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.income_Tax_Number_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
              [{ text: 'VAT number', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.vat_Number_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
              [{ text: 'Company registration document (CIPC)', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Reg_Doc_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
              [{ text: 'Letters of good standing COID', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.letter_Of_Good_Standing_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
              [{ text: 'B-BBEE certificate', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.b_BBEE_Certificate_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],
              [{ text: 'Directors details and ID', fillColor: '#e2efda' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.direcor_Details_Provided), width: 10, height: 10, fillColor: '#e2efda' }],
              [{ text: 'Company resolution authorising the counter-party to enter into an agreement with Moyo and bind the entity', fillColor: '#c6e0b4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Resolution_Agreement_Provided), width: 10, height: 10, fillColor: '#c6e0b4' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'FINANCIALS', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#4472c4' }, { text: '', fillColor: '#4472c4' }],
              [{ text: 'VAT registration certificate', fillColor: '#d9e1f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.vat_Reg_Certificate_Provided), width: 10, height: 10, fillColor: '#d9e1f2' }],
              [{ text: 'Tax clearance certificate', fillColor: '#b4c6e7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.tax_Clearance_Certificate_Provided), width: 10, height: 10, fillColor: '#b4c6e7' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'SUB-CONTRACTING', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#5b9bd5' }, { text: '', fillColor: '#5b9bd5' }],
              [{ text: 'Name of sub-contractor (company or individual)', fillColor: '#ddebf7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.subcontractor_Name_Provided), width: 10, height: 10, fillColor: '#ddebf7' }],
              [{ text: 'In case of company, provide similar documents as for main supplier', fillColor: '#bdd7ee' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.company_Details_Provided), width: 10, height: 10, fillColor: '#bdd7ee' }],
              [{ text: 'In case of individual, provide copy of ID, qualifications, accreditations and professional memberships', fillColor: '#ddebf7' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.individual_Details_Provided), width: 10, height: 10, fillColor: '#ddebf7' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'INSURANCE', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#a5a5a5' }, { text: '', fillColor: '#a5a5a5' }],
              [{ text: 'General liability insurance', fillColor: '#ededed' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.general_Liability_Insurance_Present), width: 10, height: 10, fillColor: '#ededed' }],
              [{ text: 'Cyber insurance', fillColor: '#dbdbdb' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.cyber_Insurance_Present), width: 10, height: 10, fillColor: '#dbdbdb' }],
              [{ text: 'Professional indemnity insurance (if applicable)', fillColor: '#ededed' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Indemnity_Insurance_Present), width: 10, height: 10, fillColor: '#ededed' }],
              [{ text: 'Other specific insurance required per service/industry', fillColor: '#dbdbdb' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.other_Insurance_Required), width: 10, height: 10, fillColor: '#dbdbdb' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            pageBreak: 'after',
          },
          
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'LICENSES OR PROFESSIONAL ACCREDITATION', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#44546a' }, { text: '', fillColor: '#44546a' }],
              [{ text: 'Licenses required - (specify and attach copies)', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.licenses_Required), width: 10, height: 10, fillColor: '#d6dce4' }],
              [{ text: 'Accreditation required - (specify and attach copies)', fillColor: '#acb9ca' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.accreditation_Required), width: 10, height: 10, fillColor: '#acb9ca' }],
              [{ text: 'Professional membership required - (specify and attach copies)', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.proffesional_Membership_Required), width: 10, height: 10, fillColor: '#d6dce4' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'INFORMATION SECURITY', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#375623' }, { text: '', fillColor: '#375623' }],
              [{ text: 'Business continuity plan', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.business_Continuity_Present), width: 10, height: 10, fillColor: '#a9d08e' }],
              [{ text: 'Disaster recovery plan', fillColor: '#548235' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.dIsaster_Recovery_Plan_Present), width: 10, height: 10, fillColor: '#548235' }],
              [{ text: 'Protection of personal information by design (use PPI checklist)', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.popI_Present), width: 10, height: 10, fillColor: '#a9d08e' }],
              [{ text: 'History of data breaches and security incidents', fillColor: '#548235' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.data_Security_Breaches_Present), width: 10, height: 10, fillColor: '#548235' }],
              [{ text: 'Site visits to assess security controls (if required)', fillColor: '#a9d08e' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.site_Visits_Present), width: 10, height: 10, fillColor: '#a9d08e' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'POLICY REVIEW', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#808080' }, { text: '', fillColor: '#808080' }],
              [{ text: 'Information security / Data protection policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.information_Security_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
              [{ text: 'Privacy policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.privacy_Policy_Present_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
              [{ text: 'Data retention and destruction policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.data_Retention_Destruction_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
              [{ text: 'Anti-bribery and anti-corruption policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.anti_Bribery_Corruption_Policy_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
              [{ text: 'Ethics policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.ethics_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],
              [{ text: 'Conflict of interest policy', fillColor: '#d9d9d9' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.conflict_Of_Interest_Policy_Present), width: 10, height: 10, fillColor: '#d9d9d9' }],
              [{ text: 'Customer complaints policy', fillColor: '#f2f2f2' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.customer_Complaints_Policy_Present), width: 10, height: 10, fillColor: '#f2f2f2' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', 'auto'],
              body: [[{ text: 'BUSINESS REFERENCES', fontSize: 16, alignment: 'center', color: '#ffffff', fillColor: '#44546a' }, { text: '', fillColor: '#44546a' }],
              [{ text: 'Details of at least two business references: Client name and address, Contact person and role in client organisation Contact number,E-mail address', fillColor: '#d6dce4' }, { image: this.CheckBoxSelection(this.DueDilligenceDetails.business_References_Present), width: 10, height: 10, fillColor: '#d6dce4' }],]
            },
            layout: {
              hLineWidth: function (i, node) {
                if (i === 0 || i === node.table.body.length || i === 1) {

                  return 1;
                }
                else {
                  return 0;
                }

              },
              vLineWidth: function (i) {
                if (i === 0 || i === 2) {
                  return 1;
                }
                else {
                  return 0
                }

              },
              hLineColor: function (i) {
                return i ? 'black' : '#000000'

              },
              vLineColor: function (i) {
                return i ? 'black' : '#000000'
              },

            },
            margin: [0, 0, 0, 15],
          },
          ],
          pageMargins: [40, 80, 40, 60],


        };
        pdfMake.createPdf(docDefinition).open();
      }

    })
  }




  GetCode(i: number) {
    switch (i) {
      case 1: {
        return "(C)";
        break;
      }
      case 2: {
        return "(JC)";
        break;
      }
      case 3: {
        return "(P)";
        break;
      }
      default: {
        return "(SP)";
        break;
      }
    }
  }

  CheckBoxSelection(TOF: boolean) {
    if (TOF == true) {
      return this.boxCheckedTrue
    }
    else {
      return this.boxCheckedFalse
    }
  }

  convertImageToBase64(filePath: string) {
    const response = fetch(filePath).then((res) => res.blob()).then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (filePath == "./assets/Images/CheckMarkBox.png") {
          this.boxCheckedTrue = reader.result
        }
        else {
          this.boxCheckedFalse = reader.result
        }

      };
      reader.readAsDataURL(blob);
    });
  }



  SoleSupplierApproved() {
    this.dataService.ChangeVendorStatus(2, this.onboardRequest[0].vendor_ID).subscribe();
    this.dataService.ChangeOnboardStatus(5, this.onboardRequest[0].onboard_Request_Id, this.onboardRequest[0].vendor_ID).subscribe()
    this.dataService.GenerateSoleSupplierPerformanceNotification().subscribe();

    this.VendorNotification.notification_Type_ID = 13;
    let transVar: any
    transVar = new DatePipe('en-ZA');
    this.VendorNotification.send_Date = transVar.transform(new Date(), 'MM d, y');
    this.VendorNotification.name = this.onboardRequest[0].vendor.name + " requires due diligence details"
    this.VendorNotification.user_ID = 1;
    this.dataService.VendorAddNotification(this.VendorNotification).subscribe();
    var action = "APPROVED";
    var title = "APPROVE SUCCESSFUL";
    var message: SafeHtml = this.sanitizer.bypassSecurityTrustHtml("Successfully <strong style='color:green'> APPROVED </strong> <strong>" + this.onboardRequest[0].vendor.name + "</strong>.");

    const dialogRef: MatDialogRef<NotificationdisplayComponent> = this.dialog.open(NotificationdisplayComponent, {
      disableClose: true,
      data: { action, title, message }
    });

    const duration = 2000;
    setTimeout(() => {
      //this.router.navigate(['/request-view'], {queryParams: {refresh: true}});
      this.router.navigate(['/vendor-unofficial-vendorlist'])
      dialogRef.close();
    }, duration);
  }






  openOnboard3QuotesTab(): void {
    const userManualUrl = 'assets/PDF/ARGeneralVendorUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
  openApproveRejectSoleTab(): void {
    const userManualUrl = 'assets/PDF/ARSoleVendorUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }

  openOnboardRequestCleanTab(): void {
    const userManualUrl = 'assets/PDF/ViewApproveVendorUM.pdf'; 
    window.open(userManualUrl, '_blank');
  }
 

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
