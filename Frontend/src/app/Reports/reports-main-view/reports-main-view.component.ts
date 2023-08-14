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



@Component({
  selector: 'app-reports-main-view',
  templateUrl: './reports-main-view.component.html',
  styleUrls: ['./reports-main-view.component.css']
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
          {table: {
            headerRows: 0,
            widths: [ '*', 'auto' ],
            body: [
              [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 150, height: 50,margin:[5,5,0,5]}, {} ],
            ]
          },
          layout: 'noBorders',margin:[0,0,0,10]},
          {
            text: 'Approved Vendor List Report',
            fontSize: 18,
            alignment: 'center',
            color: '#244688',
            bold: true
          },
          {
            text: 'Created By: ' + User,
            fontSize: 12,
            alignment: 'center',
          },
          {
            text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            fontSize: 12,
            alignment: 'center',
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
{text:'**End of Report**',fontSize: 12,alignment: 'center'}
    ] 

      const docDefinition = {
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
  


//   GenerateBEESpendtReport() {
//     this.ReportService.getBEESpendReport().subscribe(result => {
//       this.BEESpendReportDetails = result;
//       var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))

//       let content = [
//         {table: {
//           headerRows: 1,
//           widths: [ '*', 'auto' ],
//           body: [
//             [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 150, height: 50,margin:[5,5,0,5]}, {} ],
//           ]
//         },
//         layout: 'noBorders',margin:[0,0,0,10]},
        
//         {
//           text: 'BEE Spent Report',
//           fontSize: 18,
//           alignment: 'center',
//           color: '#244688',
//           bold: true
//         },
//         {
//           text: 'Created By: ' + User,
//           fontSize: 12,
//           alignment: 'center',
//         },
//         {
//           text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
//           fontSize: 12,
//           alignment: 'center',
//         },
//         {
//           canvas: [
//             // Centered line with space above
//             { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//           ],
//           // Add space above the line
//           margin: [0, 10]
//         },
//         {text:'Overall BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//         { 
//         table: {headerRows: 1,
//         widths: [ '*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//         body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//         {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//         [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 1).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 2).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 3).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 4).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 5).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 6).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 7).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 8).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//         [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//         {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//         [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 1).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 2).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 3).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 4).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 5).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 6).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 7).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 8).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails).toFixed(2),fillColor: '#b4c6e7'}]],
//         layout: {
//           hLineWidth: function (i, node) {
//             if (i === 0 || i === node.table.body.length || i === 1) {
              
//               return 1;
//             }
//             else {
//               return 0;
//             }
            
//           },
//           vLineWidth: function (i) {
//             if (i === 0 || i === 2) {
//               return 1;
//             }
//             else {
//               return 0
//             }
            
//           },
//           hLineColor: function (i) {
//               return i ? 'black' : '#000000'
       
//           },
//           vLineColor: function (i) {
//               return i ? 'black' : '#000000'
//           },
          
//         },
//         margin:[0,0,0,15],
//       },

//     },
//     {
//       canvas: [
//         // Centered line with space above
//         { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//       ],
//       // Add space above the line
//       margin: [0, 10]
//     },
//     //MDA
//     {text:'MBA BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//         { 
//         table: {headerRows: 1,
//         widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//         body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//         {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//         {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//         [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x => x.branchName == "MBA").reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//         [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//         {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//         {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//         [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "MBA")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//         {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == "MBA")).toFixed(2),fillColor: '#b4c6e7'}]],
//         layout: {
//           hLineWidth: function (i, node) {
//             if (i === 0 || i === node.table.body.length || i === 1) {
              
//               return 1;
//             }
//             else {
//               return 0;
//             }
            
//           },
//           vLineWidth: function (i) {
//             if (i === 0 || i === 2) {
//               return 1;
//             }
//             else {
//               return 0
//             }
            
//           },
//           hLineColor: function (i) {
//               return i ? 'black' : '#000000'
       
//           },
//           vLineColor: function (i) {
//               return i ? 'black' : '#000000'
//           },
          
//         },
//         margin:[0,0,0,15],
//       },

//     },
//     {
//       canvas: [
//         // Centered line with space above
//         { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//       ],
//       // Add space above the line
//       margin: [0, 10]
//     },
//      //VEN
//      {text:'VEN BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//      { 
//      table: {headerRows: 1,
//      widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//      body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//      [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x => x.branchName == "VEN").reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//      [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//      [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "VEN")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == "VEN")).toFixed(2),fillColor: '#b4c6e7'}]],
//      layout: {
//        hLineWidth: function (i, node) {
//          if (i === 0 || i === node.table.body.length || i === 1) {
           
//            return 1;
//          }
//          else {
//            return 0;
//          }
         
//        },
//        vLineWidth: function (i) {
//          if (i === 0 || i === 2) {
//            return 1;
//          }
//          else {
//            return 0
//          }
         
//        },
//        hLineColor: function (i) {
//            return i ? 'black' : '#000000'
    
//        },
//        vLineColor: function (i) {
//            return i ? 'black' : '#000000'
//        },
       
//      },
//      margin:[0,0,0,15],
//    },

//  },
//  {
//    canvas: [
//      // Centered line with space above
//      { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//    ],
//    // Add space above the line
//    margin: [0, 10]
//  },
//   //ENG
//      {text:'ENG BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//      { 
//      table: {headerRows: 1,
//      widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//      body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//      [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x => x.branchName == "ENG").reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//      [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//      [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "ENG")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == "ENG")).toFixed(2),fillColor: '#b4c6e7'}]],
//      layout: {
//        hLineWidth: function (i, node) {
//          if (i === 0 || i === node.table.body.length || i === 1) {
           
//            return 1;
//          }
//          else {
//            return 0;
//          }
         
//        },
//        vLineWidth: function (i) {
//          if (i === 0 || i === 2) {
//            return 1;
//          }
//          else {
//            return 0
//          }
         
//        },
//        hLineColor: function (i) {
//            return i ? 'black' : '#000000'
    
//        },
//        vLineColor: function (i) {
//            return i ? 'black' : '#000000'
//        },
       
//      },
//      margin:[0,0,0,15],
//    },

//  },
//  {
//    canvas: [
//      // Centered line with space above
//      { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//    ],
//    // Add space above the line
//    margin: [0, 10]
//  },
//   //MTS
//      {text:'MTS BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//      { 
//      table: {headerRows: 1,
//      widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//      body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//      {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//      [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x => x.branchName == "MTS").reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//      [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//      {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//      {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//      [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "MTS")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//      {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == "MTS")).toFixed(2),fillColor: '#b4c6e7'}]],
//      layout: {
//        hLineWidth: function (i, node) {
//          if (i === 0 || i === node.table.body.length || i === 1) {
           
//            return 1;
//          }
//          else {
//            return 0;
//          }
         
//        },
//        vLineWidth: function (i) {
//          if (i === 0 || i === 2) {
//            return 1;
//          }
//          else {
//            return 0
//          }
         
//        },
//        hLineColor: function (i) {
//            return i ? 'black' : '#000000'
    
//        },
//        vLineColor: function (i) {
//            return i ? 'black' : '#000000'
//        },
       
//      },
//      margin:[0,0,0,15],
//    },

//  },
//  {
//    canvas: [
//      // Centered line with space above
//      { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//    ],
//    // Add space above the line
//    margin: [0, 10]
//  },
//   //CPT
//   {text:'CPT BEE Spend Summary',fontSize: 12,alignment: 'center',color: '#244688'},
//   { 
//   table: {headerRows: 1,
//   widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
//   body:[[{text:'BEE Level',alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//   {text:'1',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'2',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'3',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'4',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'5',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'6',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'7',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'8',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'Non-Compliant',alignment: 'center',color: '#ffffff',fillColor: '#244688'},
//   {text:'Total',alignment: 'center',color: '#ffffff',fillColor: '#244688'}],
//   [{ text: 'Procurement Spend', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x => x.branchName == "CPT").reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'}],
//   [{ text: 'Procurement %', bold: true ,alignment: 'left',color: '#ffffff',fillColor: '#244688'},
//   {text:'135%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'125%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'110%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'100%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'80%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'60%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'50%',alignment: 'center',fillColor: '#d9e2f3'},
//   {text:'10%',alignment: 'center',fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'},{text:"",fillColor: '#d9e2f3'}],
//   [{ text: 'Procurement Entitlement', bold: true,alignment: 'left',color: '#ffffff',fillColor: '#244688' },
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 1) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 2) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 3) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 4) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 5) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 6) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 7) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 8) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.BEESpendReportDetails.filter(x=> (x.beE_Level == 0) && (x.branchName == "CPT")).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2),fillColor: '#b4c6e7'},
//   {text:this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == "CPT")).toFixed(2),fillColor: '#b4c6e7'}]],
//   layout: {
//     hLineWidth: function (i, node) {
//       if (i === 0 || i === node.table.body.length || i === 1) {
        
//         return 1;
//       }
//       else {
//         return 0;
//       }
      
//     },
//     vLineWidth: function (i) {
//       if (i === 0 || i === 2) {
//         return 1;
//       }
//       else {
//         return 0
//       }
      
//     },
//     hLineColor: function (i) {
//         return i ? 'black' : '#000000'
 
//     },
//     vLineColor: function (i) {
//         return i ? 'black' : '#000000'
//     },
    
//   },
//   margin:[0,0,0,15],
// },

// },
// { 
// canvas: [
//   // Centered line with space above
//   { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
// ]
// },
// ...(Number(this.BEESpendReportDetails.reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) ? [{text:'Column Chart for Total Procurement Entitlement Per BEE Level',fontSize: 12,alignment: 'center',color: '#244688',margin:[0, 350,0,10]},
// {image:this.columnChartbasestring.toBase64Image('image/png') ,fit: [550, 700]},] : []

//   ]

//   if(Number(this.BEESpendReportDetails.reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
//     content.push()
//   }


//   if(Number(this.BEESpendReportDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
//     content.push(
//       { 
//         canvas: [
//           // Centered line with space above
//           { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//         ],
//         // Add space above the line
//         margin: [0, 10,0,450]
//         },  
//     {text:'Non-Compliance Amount Per Entity',fontSize: 12,alignment: 'center',color: '#244688'}, 
//     {image:this.pieChartBaseString.toBase64Image('image/png') ,fit: [550, 550]},
//     { 
//       canvas: [
//         // Centered line with space above
//         { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//       ],
//       // Add space above the line
//       margin: [0, 10]
//       },
//       {text:'**End of Report**',fontSize: 12,alignment: 'center'}
//       )
//     }
//     else {
//       content.push({ 
//         canvas: [
//           // Centered line with space above
//           { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
//         ],
//         // Add space above the line
//         margin: [0, 10,0,10]
//         },
//         {text:'**End of Report**',fontSize: 12,alignment: 'center'})
//     }

       

//       const docDefinition = {
//         content: content,
//       defaultStyle: {
//         fontSize: 6,alignment: 'center'
//       } 
//       };   
//       //docDefinition.push()
//       pdfMake.createPdf(docDefinition).open();

//     })
//   }

//   getProcurementEntitlementTotal(ReportsDetails: BEESpentReportVM[]) {
//     let total = 0;
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 1).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 2).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 3).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 4).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 5).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 6).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 7).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 8).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2))
//     total += Number(ReportsDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))


//     return total
//   }

//   getColumnChart(ReportsDetails: BEESpentReportVM[]){
//     //var canvar_bar = document.createElement("canvas");
    

  
   
//     var mybar = new Chart('bar', {
//       type: 'bar',
//       data: {
//         labels: ["Level 1","Level 2","Level 3","Level 4","Level 5","Level 6","Level 7","Level 8"],
//         datasets: [{
//           data: [
//             ReportsDetails.filter(x=> x.beE_Level == 1).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 2).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 3).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 4).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 5).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 6).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 7).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 8).reduce((sum, p)=> (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2),
//             ReportsDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2)],
//           borderWidth: 2,
//           borderColor:'black',
//           backgroundColor: [
//             '#4472c4',
//             '#ed7d31',
//             '#a5a5a5',
//             '#ffc000',
//             '#5b9bd5',
//             '#8cba6d',
//             '#2b487c',
//             '#a2521a',
//           ],
//         }
//         ]
//       },
//       options: {
//         animation:{
//           duration:0
//         },
//         plugins: {  
//           title: {
//             display:true,
//             text:"Total Procurement Entitlement Per BEE Level",
//             font:{weight: 'bold',size:14},
//             color:'black'
//           },
//           legend: {
//            display:false
//           },
//           datalabels:{
//             anchor:'end',
//             align:'top',
//             color:'black',
//             formatter: (value, ctx) => {
//               const datapoints = ctx.chart.data.datasets[0].data
//               return "R " + Number(value).toFixed(2);
//             },
//           }
//         },
//         scales: {
//           y: {
//             title: 
//             { 
//               text: "Procurement Entitlement (R)",
//               display:true,
//               font:{weight: 'bold',size:14},
//               color:'black'
//             },
//             beginAtZero: true
//           },
//           x: {
//             title: {
//               text:"Procurement Entitlement Per BEE Level",
//               display:true,
//               font:{weight: 'bold',size:14},
//               color:'black'
//             }
//           }
//         }
       
//       },
//       plugins: [ChartDataLabels ]
//      })
//     // Chart.defaults.plugins.
//      //Chart.defaults.plugins.datalabels.anchor = 'end';
     
//      //let sURL = 'data:image/jpeg;
//      //console.log(mybar.width)
//     // console.log(mybar.toBase64Image('image/jpeg',1))
//      return mybar
//   }

//   getPieChart(ReportsDetails: BEESpentReportVM[]){
//     //var canvar_bar = document.createElement("canvas");
//     let total = Number(ReportsDetails.filter(x=> x.beE_Level == 0).reduce((sum, p)=> (sum + Number(p.totalSpend)),0).toFixed(2))
//     let percentPipe = new PercentPipe('en-ZA');
//     var myPie = new Chart('pie', {
//       type: 'pie',
//       data: {
//         labels: ["MBA","VEN","ENG","MTS","CPT"],
//         datasets: [{
//           data: [
//             (Number(ReportsDetails.filter(x=> (x.branchName == "MBA" ) && (x.beE_Level == 0)).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))/total),
//             (Number(ReportsDetails.filter(x=> (x.branchName == "VEN") && (x.beE_Level == 0)).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))/total),
//             (Number(ReportsDetails.filter(x=> (x.branchName == "ENG") && (x.beE_Level == 0)).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))/total),
//             (Number(ReportsDetails.filter(x=> (x.branchName == "MTS") && (x.beE_Level == 0)).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))/total),
//             (Number(ReportsDetails.filter(x=> (x.branchName == "CPT") && (x.beE_Level == 0)).reduce((sum, p)=> (sum + Number(p.totalSpend)), 0).toFixed(2))/total)],
//           borderWidth: 2,
//           borderColor:'black',
//           backgroundColor: [
//             '#4472c4',
//             '#ed7d31',
//             '#a5a5a5',
//             '#ffc000',
//             '#5b9bd5',
//           ],
//         }
//         ]
//       },
//       options: {
//         animation:{
//           duration:0
//         },
//         plugins: {
          
//           title: {
//             display:true,
//             text:"Non-Compliance Amount Per Entity (R)",
//             color:'black',
//             font:{weight: 'bold',size:14}
//           },
//           legend: {
//             position:'bottom'
//           },
          
//           datalabels:{
//             color:'black',
//             anchor:'center',
//             align:'end',
//             formatter: (value, ctx) => {
//               const datapoints = ctx.chart.data.datasets[0].data
//                const total = datapoints.reduce((total, datapoint) =>  Number(total) + Number(datapoint), 0)
//               const percentage = value / Number(total) * 100
//               return percentage.toFixed(2) + "%";
//             },
//           }
//         },        
//       },
//       plugins: [ChartDataLabels ]
//      })

//      return myPie
//   }
 

  GenerateVendorSpentReport() {
    this.ReportService.getVendorSpentReport().subscribe(result => {
      this.VendorSpentReportDetails = result;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      var CurrencyTransform = new CurrencyPipe('en-ZA')
      let uniqueBranches =  this.VendorSpentReportDetails.map(p => (p.branchName)).filter((name,index,currentval) => currentval.indexOf(name) === index)
      console.log(this.VendorSpentReportDetails)
      let content = [
        {table: {
          headerRows: 1,
          widths: [ '*', 'auto' ],
          body: [
            [ {image: this.logoImageBase64,alignment:'left',fillColor:"#244688", width: 150, height: 50,margin:[5,5,0,5]}, {} ],
          ]
        },
        layout: 'noBorders',margin:[0,0,0,10]},
        
        {
          text: 'Vendor Spent Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true
        },
        {
          text: 'Created By: ' + User,
          fontSize: 12,
          alignment: 'center',
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
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
{text:'**End of Report**',fontSize: 12,alignment: 'center'})
  
      const docDefinition = {
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
  
}




