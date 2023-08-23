import { Component, Inject, OnInit, ViewChild, Injectable, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { BudgetLine } from '../Shared/BudgetLine';
import { BudgetCategory } from '../Shared/BudgetCategory';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@Injectable()
export class YearOnlyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    return date.getFullYear().toString();
  }
}

export const YEAR_ONLY_FORMAT = {
  parse: { dateInput: 'YYYY' },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css'],
  providers: [
    { provide: DateAdapter, useClass: YearOnlyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMAT },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ]
})

export class YearPickerComponent {
  Year: any = {
    year: 0,
  }
  yearFilter: any;
  filter: any;
  lineChart: any;
  public showCanvas: boolean = true;
  constructor(public dialogRef: MatDialogRef<YearPickerComponent>, private ActRoute: ActivatedRoute, private formBuilder: FormBuilder, private ReportService: DataService, private dialog: MatDialog, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { ID: number, sDownload: boolean }) { }

  @ViewChild('barCanvas', { static: false }) barCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('expensesChart', { static: false }) expensesChart: ElementRef<HTMLCanvasElement>;
  @ViewChild('dp1') dp1: MatDatepicker<Date>;
  currentYear = new Date().getFullYear()
  currentmonth = new Date().getMonth();
  currentDay = new Date().getDate();
  MaxDate: Date;

  yearPick: FormGroup = new FormGroup({});
  groupedBudgetLines: {
    department: string;
    lines: {
      account_Code: string,
      actualAmt: number,
      budgetAmt: number,
      variance: number
      month: string,
      budget_Allocation: BudgetAllocation,
      budget_Category: BudgetCategory
    }[]
  }[] = [];

  detailedVariancesByDepartment: {
    department: string,
    variance: number,
    actualAmount: number,
    budgetedAmount: number
  }[] = [];



  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  chart: any;
  businessUnitAllocationChartImageBase64: string;
  budgetVarianceLineChartImageBase64: String;
  budgetVarianceBarChartImageBase64: String;
  monthlyAverageLineChartImageBase64: String;


  ApprovedVendorDetails: VendorOnboardRequest[] = [];
  BEESpendReportDetails: BEESpentReportVM[] = [];
  VendorSpentReportDetails: VendorSpentReport[] = [];
  columnChartbasestring: any;
  logoImageBase64: any;
  pieChartBaseString: any;
  myBar: any;

  barChart: any;
  ngOnInit(): void {
    //this.MaxDate = new Date(this.currentYear, this.currentmonth, this.currentDay);

    this.yearPick = this.formBuilder.group({
      year: [Date.now(), [Validators.required]],
    })
  }



  onCancel(): void {
    this.dialogRef.close();

  }

  notifyYearDialogClosed() {
    this.dialogRef.afterClosed().subscribe(result => {
      this.ReportService.notifyYearDialogClosed();
    });
  }
  notifyYearDialogClosed2() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(result => {
      this.ReportService.notifyYearDialogClosed2();
    });
  }



  onConfirm(ID: number, boolValue: boolean): void {


    let DateTransf: any
    DateTransf = new DatePipe('en-ZA');

    let date = this.yearPick.get('year')?.value
    this.Year.year = date.getFullYear();
    sessionStorage.setItem('year', this.Year.year);
    // this.ReportService.setYearFilter(this.Year.year)
    switch (ID) {
      // case 2: {
      //   this.ReportService.getBEESpendReport(DateTransf.transform(this.range.get("start")?.value, 'MM, d, y, hh:mm:ss'), DateTransf.transform(this.range.get("end")?.value, 'MM, d, y, hh:mm:ss')).subscribe(result => {
      //     this.BEESpendReportDetails = result;
      //     if (Number(this.BEESpendReportDetails.reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
      //       this.columnChartbasestring = this.getColumnChart(this.BEESpendReportDetails);
      //     }
      //     if (Number(this.BEESpendReportDetails.filter(x => x.beE_Level == 0).reduce((sum, p) => (sum + Number(p.totalSpend)), 0).toFixed(2)) != 0) {
      //       this.pieChartBaseString = this.getPieChart(this.BEESpendReportDetails);
      //     }
      //     this.GenerateBEESpendtReport();


      //     this.onCancel()
      //   })

      // }
      //   break;

      case 6: {

        this.notifyYearDialogClosed()
      }
        break;
      case 5: {

        this.notifyYearDialogClosed2()
      }
    }
  }

  onYearSelected(event: any) {
    // Set only the year to the form control
    this.yearPick.get('year').setValue(event.getFullYear());

    // Close the datepicker
    this.dp1.close();
  }

  displayYearOnly(date: Date | null): string {
    return date ? date.getFullYear().toString() : '';
  }

  public myError = (controlName: string, errorName: string) => {
    return this.yearPick.controls[controlName].hasError(errorName);
  }

  public onsYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    //console.log(normalizedYear)
    this.yearPick.get("year").setValue(new Date(normalizedYear, 12, 0));
    console.log(this.yearPick)
    //console.log(this.budgetAllocationForm.get("year").value())
    datepicker.close();
  }
  generateBudgetVarianceReport(): void {
    this.ReportService.yearFilter$.subscribe(data => {
      console.log(data);
    });

    this.ReportService.GetMonthlyBudgetDataForCategory(2023).subscribe(data => {

      var ReportData = data;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      var CurrencyTransform = new CurrencyPipe('en-ZA')
      let uniqueCategories = data.map(p => p.budget_Category.account_Name).filter((name, index, currentval) => currentval.indexOf(name) === index);

      let content = [
        {
          text: 'Budget Variance Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true
        },
        {
          text: 'Created By: ' + User,
          fontSize: 12,
          alignment: 'center',
          bold: true
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          fontSize: 12,
          alignment: 'center',
          bold: true
        },
        // {
        //   text: 'For Year: ' + year,
        //   fontSize: 12,
        //   alignment: 'center',
        //   bold: true
        // },
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
            widths: [62, 54, 96, 96, 50, 50],
            body: [[

              { text: 'Month', color: '#ffffff', fillColor: '#244688' },
              { text: 'Budget Category', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Budget Amount', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Actual Amount', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Variance', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Variance (%)', alignment: 'center', color: '#ffffff', fillColor: '#244688' }
            ],
            ...data.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).map(p => ([{ text: p.month, fillColor: '#b4c6e7' }, { text: p.budget_Category.account_Name, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.budgetAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.actualAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.variance), 'R'), fillColor: '#b4c6e7' }, { text: (p.variance / p.budgetAmt * 100).toFixed(2) + '%', fillColor: '#b4c6e7' }])),
            [{ text: 'Total Amount for ' + uniqueCategories[0], colSpan: 2, fillColor: '#d9e2f3' }, {}, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: '', fillColor: '#d9e2f3' }],
            [{ text: ' ', colSpan: 6, fillColor: "#244688" }, {}, {}, {}, {}],
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
        ...(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + 0, 0).toFixed(2)) != 0) ? [{ text: 'Bar Chart Showing Total Expenses For Different Categories', fontSize: 18, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.budgetVarianceBarChartImageBase64, fit: [550, 700] },] : []

      ]
      for (let i = 1; i < uniqueCategories.length; i++) {



        if (ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[i]).length != 0) {
          content.push(
            {
              table: {
                headerRows: 0,
                widths: [62, 54, 96, 96, 50, 50],
                body: [
                  ...data.filter(x => x.budget_Category.account_Name == uniqueCategories[i]).map(p => ([{ text: p.month, fillColor: '#b4c6e7' }, { text: p.budget_Category.account_Name, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.budgetAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.actualAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.variance), 'R'), fillColor: '#b4c6e7' }, { text: (p.variance / p.budgetAmt * 100).toFixed(2) + '%', fillColor: '#b4c6e7' }])),
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
                widths: [125, 96, 96, 50, 50, 60],
                body: [
                  [{ text: 'Total Amount for ' + uniqueCategories[i], colSpan: 1, fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[i]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[i]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[i]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: '', fillColor: '#d9e2f3' }],
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
                widths: [454],
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


      content.push({

        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
        // Add space above the line
        margin: [0, 10, 0, 10]
      },
        ...(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)) != 0) ? [{ text: 'Bar Chart Showing Total Expenses For Different Categories', fontSize: 18, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.budgetVarianceBarChartImageBase64, fit: [550, 700] },] : []




      )
      content.push({

        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
        // Add space above the line
        margin: [0, 10, 0, 10]
      },
        ...(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)) != 0) ? [{ text: 'Line Chart Showing Monthly Expenditure', fontSize: 18, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.budgetVarianceLineChartImageBase64, fit: [550, 700] },] : [],
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


      pdfMake.createPdf(docDefinition).open();

    });
  }

  initializeBarChart(): void {

    let ctxBar = this.barCanvas.nativeElement.getContext('2d');

    this.ReportService.GetYearlyTotalsForCategory(2023).subscribe(data => {
      let categories = Object.keys(data);
      let yearlyTotals = Object.values(data);

      this.barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Yearly Totals',
            data: yearlyTotals,
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
              stacked: false
            },
            y: {
              type: 'linear',
              stacked: false
            }
          }
        }
      });

      setTimeout(() => {

        this.budgetVarianceBarChartImageBase64 = this.barChart.toBase64Image();
        this.barChart.destroy();
        // this.showCanvas = false;  // Hide the canvas
      }, 500);
    });


  }

  initializeLineChart(): void {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    let ctxLine = this.expensesChart.nativeElement.getContext('2d');

    // Call the GetMonthlyTotals function to get the monthly totals
    this.ReportService.GetMonthlyTotals(2023).subscribe(data => {
      let dataArray = Array.isArray(data) ? data : Object.entries(data).map(([month, total]) => ({ month, total }));

      // Sort the dataArray based on the month order
      dataArray.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      let months = dataArray.map(monthData => monthData.month);
      let monthlyTotals = dataArray.map(monthData => monthData.total);

      this.lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Expenditure',
            data: monthlyTotals,
            borderColor: 'rgba(75, 192, 192, 0.5)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category'
            },
            y: {
              type: 'linear'
            }
          }
        }
      });
      setTimeout(() => {

        this.budgetVarianceLineChartImageBase64 = this.lineChart.toBase64Image();
        this.lineChart.destroy();
        // this.showCanvas = false;  // Hide the canvas
      }, 500);
    });


  }

}
