import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';

import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { BEESpentReportVM } from 'src/app/Shared/BEESpentReportVM';
import { Chart, plugins } from 'chart.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { VendorSpentReport } from 'src/app/Shared/VendorSpentReport';
import { ReportFilterMenuComponent } from '../report-filter-menu/report-filter-menu.component';
import { identifierName } from '@angular/compiler';
import { ReportsIFrameComponent } from 'src/app/HelpIFrames/ReportsIFrame/reports-iframe/reports-iframe.component';


import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Component({
  selector: 'app-reports-main-view',
  templateUrl: './reports-main-view.component.html',
  styleUrls: ['./reports-main-view.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}]
})
export class ReportsMainViewComponent implements OnInit{

  constructor(private ReportService: DataService, private dialog:MatDialog,private router:Router) { }

  ApprovedVendorDetails:VendorOnboardRequest[] = [];
  BEESpendReportDetails:BEESpentReportVM[] = [];
  VendorSpentReportDetails:VendorSpentReport[] = [];
  columnChartbasestring:any;
  logoImageBase64:any;
  pieChartBaseString:any;
  myBar:any;
  //splitButtons = document.getElementsByClassName('gui-split-button')
  //popupButtons = document.getElementsByClassName('gui-popup-button')
  ngOnInit(): void {
    
    //this.ReportService.getBEESpendReport().subscribe(result => {
     // this.BEESpendReportDetails = result;
      this.convertImageToBase64()
    // this.columnChartbasestring = this.getColumnChart(this.BEESpendReportDetails);
    // this.pieChartBaseString = this.getPieChart(this.BEESpendReportDetails);
    // console.log(this.columnChartbasestring.toBase64Image('image/png'))
   // })
  }

  convertImageToBase64() {
    let filePath = "./assets/Images/moyo-full-logo2.png";
    const response = fetch(filePath).then((res) => res.blob()).then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => { 
        this.logoImageBase64 = reader.result   
      };
      reader.readAsDataURL(blob);
  });
  }

  GenerateApprovedReport() {
    this.ReportService.getAllApprovedVendors(3).subscribe(result => {
      this.ApprovedVendorDetails = result;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      console.log(this.ApprovedVendorDetails)
      let content = [ 
          {
            text: 'Approved Vendor List Report',
            fontSize: 18,
            alignment: 'center',
            color: '#244688',
            bold: true,
            margin:[0,50,0,0]
          },
          {
            text: 'Created By: ' + User,
            fontSize: 12,
            alignment: 'center',
            bold:true,
          },
          {
            text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            fontSize: 12,
            alignment: 'center',
            bold:true,
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
          table: {headerRows: 0,
          widths: ['*','auto','auto','auto'],
          body:[
            
            [
              {text:'Name',color: '#ffffff',fillColor: '#244688'},
              {text:'Email',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
              {text:'Preffered Vendor',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
              {text:'Sole Supplier',alignment: 'center',color: '#ffffff',fillColor: '#244688'},],
             ...this.ApprovedVendorDetails.map(p => ([{text:p.name,fillColor: '#b4c6e7'},{text:p.email,fillColor: '#b4c6e7'}, ...(p.preferedVendor == true) ? [{text:'Yes',fillColor: '#b4c6e7'}]:[{text:'No',fillColor: '#b4c6e7'}],...(p.sole_Supplier_Provided == true) ? [{text:'Yes',fillColor: '#b4c6e7'}]:[{text:'No',fillColor: '#b4c6e7'}]])),
          ],
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
          margin:[0,0,0,15],
        }, 
      },
      {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
   // Add space above the line
   margin: [0, 5,0,10]
},
{text:'**End of Report**',fontSize: 12,alignment: 'center',bold:true,}
    ] 
    
      const docDefinition = {
        footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
        header: {
          margin:[0,0,0,150],
          table: {
            headerRows: 0,
            widths: [ '*', 'auto' ],
            body: [
              [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 200, height: 55,margin:[5,5,0,5]}, {text:"",fillColor:"#244688",alignment:'right'} ],
            ]
          },
          layout: 'noBorders',
          
      },
       
        content: content,
      defaultStyle: {
        fontSize: 7,alignment: 'center'
      } 
      };
     
      if(this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Approved Vendor Report List")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }
      } ) 
     
  }
  

  GenerateVendorSpentReport() {
    this.ReportService.getVendorSpentReport().subscribe(result => {
      this.VendorSpentReportDetails = result;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      var CurrencyTransform = new CurrencyPipe('en-ZA')
      let uniqueBranches =  this.VendorSpentReportDetails.map(p => (p.branchName)).filter((name,index,currentval) => currentval.indexOf(name) === index)
      console.log(this.VendorSpentReportDetails)
      let content = [
        {
          text: 'Vendor Spent Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true,
          margin:[0,50,0,0]
        },
        {
          text: 'Created By: ' + User,
          fontSize: 12,
          alignment: 'center',
          bold:true,
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
          bold:true,
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
        table: {headerRows: 0,
        widths: [62,54,96,54,50,40,70],
        body:[[
        {text:'Supplier',color: '#ffffff',fillColor: '#244688'},
        {text:'Account Code',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        {text:'Account Name (Budget Line)',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        {text:'Budget (Department)',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        {text:'Company (Branch)',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        {text:'BEE Level',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        {text:'Amount Spend',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
        ],
        ...this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[0]).map(p => ([{text:p.supplierName,fillColor: '#b4c6e7'}, {text:p.accountCode,fillColor: '#b4c6e7'},{text:p.accountName,fillColor: '#b4c6e7'},{text:p.budgetDepartment,fillColor: '#b4c6e7'},{text:p.branchName,fillColor: '#b4c6e7'},{text:p.beE_Level,fillColor: '#b4c6e7'},{text:CurrencyTransform.transform(Number(p.totalSpend),'R'),fillColor: '#b4c6e7'}])),
        [{text:'Total Amount for the ' + uniqueBranches[0],colSpan: 6,fillColor:'#d9e2f3'},{},{},{},{},{},{text:CurrencyTransform.transform(Number(this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[0]).reduce((sum, p)=> sum + Number(p.totalSpend), 0).toFixed(2)),'R'),fillColor:'#d9e2f3'}],
        [{text: ' ',colSpan: 7,fillColor:"#244688"}, {}, {}, {}, {}, {}],
      ],
        
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length || i === 1) ? 2 : 1;
      },
      vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
      },
      hLineColor: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
      },
      vLineColor: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
      },
    }
    },
    
  ]

 // content.push({text:'test',fontSize:12,alignment:'left',color:'blue',bold:false},)
  console.log(uniqueBranches.length);
   for(let i = 1;i < uniqueBranches.length;i++) {

    console.log(i)
    console.log(uniqueBranches[i])
    console.log(uniqueBranches.length);
    if(this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).length != 0) {
      content.push(
        { 
        table: {headerRows: 0,
        widths: [62,54,96,54,50,40,70],
        body:[
        ...this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).map(p => ([{text:p.supplierName,fillColor: '#b4c6e7'},{text: p.accountCode,fillColor: '#b4c6e7'},{text:p.accountName,fillColor: '#b4c6e7'},{text:p.budgetDepartment,fillColor: '#b4c6e7'},{text:p.branchName,fillColor: '#b4c6e7'},{text:p.beE_Level,fillColor: '#b4c6e7'},{text:CurrencyTransform.transform(Number(p.totalSpend),'R'),fillColor: '#b4c6e7'}])),
      ],},
      layout: {
        hLineWidth: function (i, node) {
          return (i === node.table.body.length) ? null : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
        },
      }
      
    },
      );//push statement 
      
      content.push(
        { 
        table: {headerRows: 0,
        widths: [401,70],
        body:[
          [{text:'Total Amount for the '+ uniqueBranches[i],alignment:'center',color:'black',fillColor:'#d9e2f3'} ,{text: CurrencyTransform.transform(Number(this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).reduce((sum, p)=> sum + Number(p.totalSpend), 0).toFixed(2)),'R'),alignment:'center',color:'black',fillColor:'#d9e2f3'}],
      ],},
      layout: {
        hLineWidth: function (i, node) {
          return (i === node.table.body.length) ? null : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
        },
      }
      
    },
      );//push statement
    content.push()
      content.push(
        { 
        table: {headerRows: 0,
        widths: [480],
        body:[
          [{text:' ',fillColor:"#244688"}],
      ],},
      layout: {
        hLineWidth: function (i, node) {
          return (i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
        },
      }
      
    },
      );//push statement
    }//if statement 
    
   }

   content.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
   // Add space above the line
   margin: [0, 10,0,10]
},
{text:'**End of Report**',fontSize: 12,alignment: 'center',bold:true})
  
      const docDefinition = {
        footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
        header: {
          margin:[0,0,0,150],
          table: {
            headerRows: 0,
            widths: [ '*', 'auto' ],
            body: [
              [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 200, height: 55,margin:[5,5,0,5]}, {text:"",fillColor:"#244688",alignment:'right'} ],
            ]
          },
          layout: 'noBorders',
          
      },
        content: content,
      defaultStyle: {
        fontSize: 7,alignment: 'center'
      } 
      };  
      //docDefinition.push()

      if(this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Vendor Spent Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }

      
    })
  }

  bDownload = false;
  iVal = 0;
  value(ID:number) {
    this.iVal = ID;
  }

  CorrectRouting(boolValue:boolean) {
    let ID=this.iVal
    switch(ID) {
      case 1: {
        this.bDownload = boolValue;
        this.GenerateApprovedReport()
      }
      break;
      case 2: {
        this.ViewFilter(2,boolValue)
      } 
      break;
      case 3: {
        this.bDownload = boolValue;
        this.GenerateVendorSpentReport()
      }
      break;
    }
  }

  ViewFilter(ID: Number,sDownload:boolean) {
    
    const confirm = this.dialog.open(ReportFilterMenuComponent, {
      disableClose: true,
      data: { ID, sDownload }
      
    });
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
        this.ngOnInit();
      }
    })
  }








  openReportsIFrameTab(): void {
    const dialogRef = this.dialog.open(ReportsIFrameComponent, {
      // width: '800px', // Set the desired width
      // height: '600px', // Set the desired height
      panelClass: 'iframe-dialog' // Apply CSS class for styling if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }
  
}




