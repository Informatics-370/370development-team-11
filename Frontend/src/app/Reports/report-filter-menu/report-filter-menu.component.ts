import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { BEESpentReportVM } from 'src/app/Shared/BEESpentReportVM';
import { Chart, plugins } from 'chart.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { VendorSpentReport } from 'src/app/Shared/VendorSpentReport';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-report-filter-menu',
  templateUrl: './report-filter-menu.component.html',
  styleUrls: ['./report-filter-menu.component.css']
})
export class ReportFilterMenuComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReportFilterMenuComponent>, private ActRoute: ActivatedRoute, private ReportService: DataService, private dialog: MatDialog, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number, sDownload: boolean }) { }

  currentYear = new Date().getFullYear()
  currentmonth = new Date().getMonth();
  currentDay = new Date().getDate();

  range = new FormGroup({
    start: new FormControl(new Date(this.currentYear, this.currentmonth, this.currentDay - 1)),
    end: new FormControl(new Date(this.currentYear, this.currentmonth, this.currentDay)),
  });

  ApprovedVendorDetails: VendorOnboardRequest[] = [];
  BEESpendReportDetails: BEESpentReportVM[] = [];
  VendorSpentReportDetails: VendorSpentReport[] = [];
  columnChartbasestring: any;
  logoImageBase64: any;
  pieChartBaseString: any;
  MaxDate: Date;
  myBar: any;
  myPie: any;
  bDownload = false;



  ngOnInit(): void {
    this.MaxDate = new Date(this.currentYear, this.currentmonth, this.currentDay);
    this.convertImageToBase64()

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

  onCancel(): void {
    this.dialogRef.close();

  }

  notifyDialogClosed() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(result => {
      this.ReportService.notifyDialogClosed();
    });
  }


  onConfirm(ID: number, boolValue: boolean): void {


    let DateTransf: any
    DateTransf = new DatePipe('en-ZA');

    const startDate = DateTransf.transform(this.range.get('start')?.value, 'yyyy-MM-dd');
    const endDate = DateTransf.transform(this.range.get('end')?.value, 'y-MM-d');
    this.ReportService.setFilter({ startDate, endDate });
    this.bDownload = boolValue;
    switch (ID) {
      case 2: {
        this.ReportService.getBEESpendReport(DateTransf.transform(this.range.get("start")?.value, 'MM, d, y'), DateTransf.transform(this.range.get("end")?.value, 'MM, d, y')).subscribe(result => {
          this.BEESpendReportDetails = result;
          if (Number(this.BEESpendReportDetails.reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
            this.columnChartbasestring = this.getColumnChart(this.BEESpendReportDetails);
          }
          if (Number(this.BEESpendReportDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
            this.pieChartBaseString = this.getPieChart(this.BEESpendReportDetails);
          }
          this.GenerateBEESpentReport();
          this.onCancel()

        })
        break;
      }
      case 3: {


        this.GenerateVendorSpentReport();
        this.onCancel()
        break;
      }
      case 4: {

        this.notifyDialogClosed()
        break;
      }
    }
  }



  GenerateBEESpentReport() {
    let DateTransf: any
    DateTransf = new DatePipe('en-ZA');
    this.ReportService.getBEESpendReport(DateTransf.transform(this.range.get("start")?.value, 'MM, d, y'), DateTransf.transform(this.range.get("end")?.value, 'MM, d, y')).subscribe(result => {
      this.BEESpendReportDetails = result;

      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      let uniqueBranches = this.BEESpendReportDetails.map(p => (p.branchName)).filter((name, index, currentval) => currentval.indexOf(name) === index)
      let content = [
        {
          text: 'BEE Spent Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true,
        },
        {
          text: 'Created By: ' + User,
          fontSize: 12,
          alignment: 'center',
          bold: true,
          decoration: 'underline',
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
          bold: true,
          decoration: 'underline',
        },
        {
          text: 'Period: ' + DateTransf.transform(this.range.get("start")?.value, 'MM/dd/y') + ' - ' + DateTransf.transform(this.range.get("end")?.value, 'MM/dd/y'),
          fontSize: 12,
          alignment: 'center',
          bold: true,
        },
        {
          canvas: [
            // Centered line with space above
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
          ],
          // Add space above the line
          margin: [0, 10]
        },
        { text: 'Overall BEE Spend Summary', fontSize: 12, alignment: 'center', color: '#244688' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [[{ text: 'BEE Level', alignment: 'left', color: '#ffffff', fillColor: '#244688' },
            { text: '1', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '2', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '3', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '4', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '5', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '6', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '7', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: '8', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: 'Non-Compliant', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            { text: 'Total', alignment: 'center', color: '#ffffff', fillColor: '#244688' }],
            [{ text: 'Procurement Spend', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 1).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 2).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 3).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 4).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 5).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 6).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 7).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 8).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' }],
            [{ text: 'Procurement %', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
            { text: '135%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '125%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '110%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '100%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '80%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '60%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '50%', alignment: 'center', fillColor: '#d9e2f3' },
            { text: '10%', alignment: 'center', fillColor: '#d9e2f3' }, { text: "", fillColor: '#d9e2f3' }, { text: "", fillColor: '#d9e2f3' }],
            [{ text: 'Procurement Entitlement', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 1).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 2).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 3).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 4).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 5).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 6).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 7).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 8).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.BEESpendReportDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
            { text: "R" + this.getProcurementEntitlementTotal(this.BEESpendReportDetails).toFixed(2), fillColor: '#b4c6e7' }]],
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

        },
        {
          canvas: [
            // Centered line with space above
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
          ],
          // Add space above the line
          margin: [0, 10]
        },
        ...(Number(this.BEESpendReportDetails.reduce((sum, p) => (sum + 0), 0).toFixed(2)) != 0) ? [{ text: 'Column Chart for Total Procurement Entitlement Per BEE Level', fontSize: 12, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.columnChartbasestring.toBase64Image('image/png'), fit: [550, 700] },] : []
      ]
      for (let a = 0; a < uniqueBranches.length; a++) {
        if (this.BEESpendReportDetails.filter(x => x.branchName == uniqueBranches[a]).length != 0) {
          let BranchName = this.BEESpendReportDetails.filter(x => x.branchName == uniqueBranches[a])[0].branchName
          content.push(
            { text: BranchName + ' BEE Spend Summary', fontSize: 12, alignment: 'center', color: '#244688' },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [[{ text: 'BEE Level', alignment: 'left', color: '#ffffff', fillColor: '#244688' },
                { text: '1', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '2', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '3', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '4', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '5', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '6', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '7', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: '8', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: 'Non-Compliant', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: 'Total', alignment: 'center', color: '#ffffff', fillColor: '#244688' }],
                [{ text: 'Procurement Spend', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 1) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 2) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 3) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 4) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 5) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 6) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 7) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 8) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 0) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => x.branchName == BranchName).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' }],
                [{ text: 'Procurement %', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
                { text: '135%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '125%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '110%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '100%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '80%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '60%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '50%', alignment: 'center', fillColor: '#d9e2f3' },
                { text: '10%', alignment: 'center', fillColor: '#d9e2f3' }, { text: "", fillColor: '#d9e2f3' }, { text: "", fillColor: '#d9e2f3' }],
                [{ text: 'Procurement Entitlement', bold: true, alignment: 'left', color: '#ffffff', fillColor: '#244688' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 1) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 2) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 3) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 4) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 5) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 6) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 7) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 8) && (x.branchName == BranchName)).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.BEESpendReportDetails.filter(x => (x.beE_Level == 0) && (x.branchName == BranchName)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2), fillColor: '#b4c6e7' },
                { text: "R" + this.getProcurementEntitlementTotal(this.BEESpendReportDetails.filter(x => x.branchName == BranchName)).toFixed(2), fillColor: '#b4c6e7' }]],
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

            },
            {
              canvas: [
                // Centered line with space above
                { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
              ], margin: [0, 10]
            },)



        }
      }
      content.push(
        ...(Number(this.BEESpendReportDetails.reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) ? [{ text: 'Column Chart for Total Procurement Entitlement Per BEE Level', fontSize: 20, alignment: 'center', color: '#244688', margin: [0, 50, 0, 10], pageBreak: 'before' },
        { image: this.columnChartbasestring.toBase64Image('image/png'), fit: [550, 700] },] : []
      )


      //fit: [550, 700]
      if (Number(this.BEESpendReportDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
        content.push(
          {
            canvas: [
              // Centered line with space above
              { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
            ],
            // Add space above the line
            margin: [0, 10, 0, 0]
          },
          { text: 'Non-Compliance Amount Per Entity', fontSize: 20, alignment: 'center', color: '#244688', margin: [0, 50, 0, 10], pageBreak: 'before' },
          { image: this.pieChartBaseString.toBase64Image('image/png'), fit: [550, 550] },
          {
            canvas: [
              // Centered line with space above
              { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
            ],
            // Add space above the line
            margin: [0, 10]
          },
          { text: '**End of Report**', fontSize: 12, alignment: 'center', bold: true, }
        )
      }
      else {
        content.push({
          canvas: [
            // Centered line with space above
            { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }
          ],
          // Add space above the line
          margin: [0, 10, 0, 10]
        },
          { text: '**End of Report**', fontSize: 12, alignment: 'center', bold: true })
      }



      const docDefinition = {
        footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
        header: {
          table: {
            headerRows: 0,
            widths: ['*', 'auto'],
            body: [
              [{ image: this.logoImageBase64, alignment: 'left', fillColor: "#244688", width: 200, height: 55, margin: [5, 5, 0, 5] }, { text: "", fillColor: "#244688", alignment: 'right' }],

            ],
          },
          layout: 'noBorders',

        },
        content: content,
        pageMargins: [40, 80, 40, 60],
        defaultStyle: {
          fontSize: 6, alignment: 'center'
        }
      };
      //docDefinition.push()
      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("BEE Spent Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }
      //pdfMake.createPdf(docDefinition).open();
      content = undefined;
      if (this.myBar) {
        this.myBar.destroy();
      }

      if (this.myPie) {
        this.myPie.destroy();
      }

    })
  }



  getProcurementEntitlementTotal(ReportsDetails: BEESpentReportVM[]) {
    let total = 0;
    total += Number(ReportsDetails.filter(x => x.beE_Level == 1).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 2).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 3).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 4).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 5).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.80)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 6).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.60)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 7).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 8).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2))
    total += Number(ReportsDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2))


    return total
  }

  getColumnChart(ReportsDetails: BEESpentReportVM[]) {
    //var grapharea = document.getElementById('bar');
    //grapharea.remove()

    // grapharea.replaceChild
    if (this.myBar) {
      this.myBar.destroy();
    }

    this.myBar = new Chart('bar', {
      type: 'bar',
      data: {
        labels: ["BEE Levels"],
        datasets: [{
          label: "Level 1",
          backgroundColor: "#4472c4",
          data: [ReportsDetails.filter(x => x.beE_Level == 1).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.35)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 2",
          backgroundColor: "#ed7d31",
          data: [ReportsDetails.filter(x => x.beE_Level == 2).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.25)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 3",
          backgroundColor: "#a5a5a5",
          data: [ReportsDetails.filter(x => x.beE_Level == 3).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1.10)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 4",
          backgroundColor: "#ffc000",
          data: [ReportsDetails.filter(x => x.beE_Level == 4).reduce((sum, p) => (sum + (Number(p.totalSpend) * 1)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 5",
          backgroundColor: "#5b9bd5",
          data: [ReportsDetails.filter(x => x.beE_Level == 5).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.80)),0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 6",
          backgroundColor: "#8cba6d",
          data: [ReportsDetails.filter(x => x.beE_Level == 6).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.60)),0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 7",
          backgroundColor: "#2b487c",
          data: [ReportsDetails.filter(x => x.beE_Level == 7).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.50)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        {
          label: "Level 8",
          backgroundColor: "#a2521a",
          data: [ReportsDetails.filter(x => x.beE_Level == 8).reduce((sum, p) => (sum + (Number(p.totalSpend) * 0.10)), 0).toFixed(2)],
          borderWidth: 2,
          borderColor: 'black',
        },
        ]

      },
      options: {
        animation: {
          duration: 0
        },
        plugins: {
          title: {
            display: true,
            text: "Total Procurement Entitlement Per BEE Level",
            font: { weight: 'bold', size: 20 },
            color: 'black'
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 16
              },
              color: 'black'
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: 'black',
            font: { size: 16 },
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[0].data
              return "R " + Number(value).toFixed(2);
            },
          }
        },
        scales: {
          y: {
            title:
            {
              text: "Procurement Entitlement (R)",
              display: true,
              font: { weight: 'bold', size: 20 },
              color: 'black'
            },
            beginAtZero: true
          },
          x: {
            title: {
              text: "Procurement Entitlement Per BEE Level",
              display: true,
              font: { weight: 'bold', size: 20 },
              color: 'black'
            }
          }
        }

      },
      plugins: [ChartDataLabels]
    })



    return this.myBar
  }

  getPieChart(ReportsDetails: BEESpentReportVM[]) {
    //var canvar_bar = document.createElement("canvas");

    let data: Number[] = []
    let labels: string[] = []
    let total = Number(ReportsDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 5).toFixed(2))
    let uniqueBranches = ReportsDetails.map(p => (p.branchName)).filter((name, index, currentval) => currentval.indexOf(name) === index)
    for (let a = 0; a < uniqueBranches.length; a++) {
      data.push((Number(ReportsDetails.filter(x => (x.branchName == uniqueBranches[a]) && (x.beE_Level == 0)).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) / total))
      labels.push(uniqueBranches[a])
    }
    let percentPipe = new PercentPipe('en-ZA');
    this.myPie = new Chart('pie', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderWidth: 2,
          borderColor: 'black',
          backgroundColor: [
            '#4472c4',
            '#ed7d31',
            '#a5a5a5',
            '#ffc000',
            '#5b9bd5',
          ],
        }
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        plugins: {

          title: {
            display: true,
            text: "Non-Compliance Amount Per Entity (R)",
            color: 'black',
            font: { weight: 'bold', size: 20 }
          },
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 16
              },
              color: 'black'
            }
          },

          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'end',
            font: { size: 16 },
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[0].data
              const total = datapoints.reduce((total, datapoint) => Number(total) + Number(datapoint), 0)
              const percentage = value / Number(total) * 100
              return percentage.toFixed(2) + "%";
            },
          }
        },
      },
      plugins: [ChartDataLabels]
    })



    return this.myPie
  }

  GenerateVendorSpentReport() {
    let DateTransf: any
    DateTransf = new DatePipe('en-ZA');
    this.ReportService.getVendorSpentReport(DateTransf.transform(this.range.get("start")?.value, 'MM, d, y, hh:mm:ss'), DateTransf.transform(this.range.get("end")?.value, 'MM, d, y, hh:mm:ss')).subscribe(result => {
      this.VendorSpentReportDetails = result;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      var CurrencyTransform = new CurrencyPipe('en-ZA')
      let uniqueBranches = this.VendorSpentReportDetails.map(p => (p.branchName)).filter((name, index, currentval) => currentval.indexOf(name) === index)
      let content = [
        {
          text: 'Vendor Spend Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true,
        },
        {
          text: 'Created By: ' + User,
          fontSize: 12,
          alignment: 'center',
          bold: true,
          decoration: 'underline',
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
          bold: true,
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
            widths: [62, 54, 96, 54, 50, 40, 70],
            body: [[
              { text: 'Supplier', color: '#ffffff', fillColor: '#244688' },
              { text: 'Account Code', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Account Name (Budget Line)', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Budget (Department)', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Company (Branch)', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'BEE Level', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Amount Spend', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
            ],
            ...this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[0]).map(p => ([{ text: p.supplierName, fillColor: '#b4c6e7' }, { text: p.accountCode, fillColor: '#b4c6e7' }, { text: p.accountName, fillColor: '#b4c6e7' }, { text: p.budgetDepartment, fillColor: '#b4c6e7' }, { text: p.branchName, fillColor: '#b4c6e7' }, { text: p.beE_Level, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.totalSpend), 'R'), fillColor: '#b4c6e7' }])),
            [{ text: 'Total Amount for the ' + uniqueBranches[0], colSpan: 6, fillColor: '#d9e2f3' }, {}, {}, {}, {}, {}, { text: CurrencyTransform.transform(Number(this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[0]).reduce((sum, p) => sum + Number(p.totalSpend), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }],
            [{ text: ' ', colSpan: 7, fillColor: "#244688" }, {}, {}, {}, {}, {}],
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

      for (let i = 1; i < uniqueBranches.length; i++) {


        if (this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).length != 0) {
          content.push(
            {
              table: {
                headerRows: 0,
                widths: [62, 54, 96, 54, 50, 40, 70],
                body: [
                  ...this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).map(p => ([{ text: p.supplierName, fillColor: '#b4c6e7' }, { text: p.accountCode, fillColor: '#b4c6e7' }, { text: p.accountName, fillColor: '#b4c6e7' }, { text: p.budgetDepartment, fillColor: '#b4c6e7' }, { text: p.branchName, fillColor: '#b4c6e7' }, { text: p.beE_Level, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.totalSpend), 'R'), fillColor: '#b4c6e7' }])),
                ],
              },
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
              table: {
                headerRows: 0,
                widths: [401, 70],
                body: [
                  [{ text: 'Total Amount for the ' + uniqueBranches[i], alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(this.VendorSpentReportDetails.filter(x => x.branchName == uniqueBranches[i]).reduce((sum, p) => sum + Number(p.totalSpend), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }],
                ],
              },
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
              table: {
                headerRows: 0,
                widths: [480],
                body: [
                  [{ text: ' ', fillColor: "#244688" }],
                ],
              },
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

      content.push(
        {
          table: {
            headerRows: 0,
            widths: [401, 70],
            body: [
              [{ text: 'Total Amount for all Branches', alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(this.VendorSpentReportDetails.reduce((sum, p) => sum + Number(p.totalSpend), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }],
            ],
          },
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

      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
        // Add space above the line
        margin: [0, 10, 0, 10]
      },
        { text: '**End of Report**', fontSize: 12, alignment: 'center', bold: true,decoration:null })

      const docDefinition = {
        footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
        header: {
          margin: [0, 0, 0, 0],
          table: {
            headerRows: 0,
            widths: ['*', 'auto'],
            body: [
              [{ image: this.logoImageBase64, alignment: 'left', fillColor: "#244688", width: 200, height: 55, margin: [5, 5, 0, 5] }, { text: "", fillColor: "#244688", alignment: 'right' }],
            ]
          },
          layout: 'noBorders',

        },
        pageMargins: [40, 80, 40, 60],
        content: content,
        defaultStyle: {
          fontSize: 7, alignment: 'center'
        }
      };
      //docDefinition.push()

      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Vendor Spent Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }


    })
  }



}
