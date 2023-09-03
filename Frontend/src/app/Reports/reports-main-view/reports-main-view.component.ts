import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/DataService/data-service';
import { VendorOnboardRequest } from 'src/app/Shared/VendorOnboardRequest';
import { Subscription } from 'rxjs';

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
import { BudgetAllocation } from 'src/app/Shared/BudgetAllocation';
import { BudgetCategory } from 'src/app/Shared/BudgetCategory';
import { ReportsIFrameComponent } from 'src/app/HelpIFrames/ReportsIFrame/reports-iframe/reports-iframe.component';
import { YearPickerComponent } from 'src/app/year-picker/year-picker.component';


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
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export class ReportsMainViewComponent implements OnInit {
  @ViewChild('barCanvas', { static: false }) barCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('expensesChart', { static: false }) expensesChart: ElementRef<HTMLCanvasElement>;

  yearFilter: any;
  filter: any;
  lineChart: any;
  public showCanvas: boolean = true;
  constructor(private ReportService: DataService, private dialog: MatDialog, private router: Router, private cdRef: ChangeDetectorRef) { }
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

  private dialogClosedSubscriptionBudgetVariance: Subscription;
  private dialogClosedSubscriptionBusinessUnit: Subscription;
  private dialogClosedSubscriptionConsumableManagement: Subscription;

  ApprovedVendorDetails: VendorOnboardRequest[] = [];
  BEESpendReportDetails: BEESpentReportVM[] = [];
  VendorSpentReportDetails: VendorSpentReport[] = [];
  columnChartbasestring: any;
  logoImageBase64: any;
  pieChartBaseString: any;

  GeneralConsumableMangementSelected: boolean = false;
  myBar: any;

  barChart: any;

  ngOnInit(): void {
    this.ReportService.filter$.subscribe(filter => {
      this.filter = filter;
    });
    this.ReportService.GetVarianceByDepartment().subscribe(data => {

      this.detailedVariancesByDepartment = Object.keys(data).map(key => {
        return {
          department: key,
          variance: data[key].item1,
          actualAmount: data[key].item2,
          budgetedAmount: data[key].item3
        };
      });
      this.initializeChart();
      this.cdRef.detectChanges();
      this.initializeBarChart();
      this.initializeLineChart();
    });
    this.convertImageToBase64()
    this.dialogClosedSubscriptionConsumableManagement = this.ReportService.dialogClosed$.subscribe(() => {
      this.generateConsumableManagementReport();
    });

    this.dialogClosedSubscriptionBudgetVariance = this.ReportService.yearDialogClosed$.subscribe(() => {
      this.generateBudgetVarianceReport();
    }
    );

    this.dialogClosedSubscriptionBusinessUnit = this.ReportService.yearDialogClosed2$.subscribe(() => {
      this.generateBusinessUnitAllocationReport();
    }
    );

  }


  ngOnDestroy(): void {
    this.dialogClosedSubscriptionBudgetVariance.unsubscribe();
    this.dialogClosedSubscriptionBusinessUnit.unsubscribe();
    this.dialogClosedSubscriptionConsumableManagement.unsubscribe();
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

      let content = [
        {
          text: 'Approved Vendor List Report',
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
        },
        {
          text: 'Generated On: ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
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
        {
          table: {
            headerRows: 0,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [

              [
                { text: 'Name', color: '#ffffff', fillColor: '#244688' },
                { text: 'Email', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: 'Preffered Vendor', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
                { text: 'Sole Supplier', alignment: 'center', color: '#ffffff', fillColor: '#244688' },],
              ...this.ApprovedVendorDetails.map(p => ([{ text: p.name, fillColor: '#b4c6e7' }, { text: p.email, fillColor: '#b4c6e7' }, ...(p.preferedVendor == true) ? [{ text: 'Yes', fillColor: '#b4c6e7' }] : [{ text: 'No', fillColor: '#b4c6e7' }], ...(p.sole_Supplier_Provided == true) ? [{ text: 'Yes', fillColor: '#b4c6e7' }] : [{ text: 'No', fillColor: '#b4c6e7' }]])),
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
            margin: [0, 0, 0, 15],
          },
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
          // Add space above the line
          margin: [0, 5, 0, 10]
        },
        { text: '**End of Report**', fontSize: 12, alignment: 'center', bold: true, }
      ]

      const docDefinition = {
        footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
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

        content: content,
        pageMargins: [40, 80, 40, 60],
        defaultStyle: {
          fontSize: 7, alignment: 'center'
        }
      };


      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Approved Vendor Report List")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }
    })

  }


  generateBusinessUnitAllocationReport(): void {
    var currYear = Number(sessionStorage.getItem('year'));

    this.ReportService.GetMonthlyBudgetDataForCategory(currYear).subscribe(data => {

      var ReportData = data;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      var CurrencyTransform = new CurrencyPipe('en-ZA')
      let uniqueDepartments = data.map(p => p.budget_Allocation.department.name).filter((name, index, currentval) => currentval.indexOf(name) === index);
      let content = [
        {
          text: 'Business Unit Allocation Report',
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
            widths: [62, 54, 96, 96, 50],
            body: [[
              { text: 'Department', color: '#ffffff', fillColor: '#244688' },
              { text: 'Account Code', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Actual Amount', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Budgeted Amount', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'Variance', alignment: 'center', color: '#ffffff', fillColor: '#244688' }
            ],
            ...ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).map(p => ([{ text: p.budget_Allocation.department.name, fillColor: '#b4c6e7' }, { text: p.budget_Category.account_Code, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.actualAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.budgetAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.variance), 'R'), fillColor: '#b4c6e7' }])),
            [{ text: 'Total Amount for ' + uniqueDepartments[0], colSpan: 2, fillColor: '#d9e2f3' }, {}, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }],
            [{ text: ' ', colSpan: 5, fillColor: "#244688" }, {}, {}, {}]],

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
        ...(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + 0, 0).toFixed(2)) != 0) ? [{ text: 'Bar Chart Showing Business Unit Allocations', fontSize: 18, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.budgetVarianceBarChartImageBase64, fit: [550, 700] },] : []

      ]
      for (let i = 1; i < uniqueDepartments.length; i++) {



        if (ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[i]).length != 0) {
          content.push(
            {
              table: {
                headerRows: 0,
                widths: [62, 54, 96, 96, 50],
                body: [
                  ...ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[i]).map(p => ([{ text: p.budget_Allocation.department.name, fillColor: '#b4c6e7' }, { text: p.budget_Category.account_Code, fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.actualAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.budgetAmt), 'R'), fillColor: '#b4c6e7' }, { text: CurrencyTransform.transform(Number(p.variance), 'R'), fillColor: '#b4c6e7' }])),
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
                widths: [125, 96, 96, 50],
                body: [
                  [{ text: 'Total Amount for  ' + uniqueDepartments[i], alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[i]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[i]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[i]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }],
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
                widths: [394],
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
            widths: [125, 96, 96, 50],
            body: [
              [{ text: 'Total Amount for all Departments', alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), alignment: 'center', color: 'black', fillColor: '#d9e2f3' }],
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

      content.push(
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
          // Add space above the line
          margin: [0, 5, 0, 10]
        },
        ...(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)) != 0) ? [{ text: 'Bar Chart Showing Business Unit Allocations', fontSize: 18, alignment: 'center', color: '#244688', margin: [0, 0, 0, 10], pageBreak: 'before' },
        { image: this.businessUnitAllocationChartImageBase64, fit: [550, 700] },] : [],


        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
          // Add space above the line
          margin: [0, 5, 0, 10]
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


      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Business Unit Allocation Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }

    });
  }

  initializeChart(): void {



    let ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    let labels = this.detailedVariancesByDepartment.map(d => d.department);
    let varianceData = this.detailedVariancesByDepartment.map(d => d.variance);
    let actualData = this.detailedVariancesByDepartment.map(d => d.actualAmount);
    let budgetedData = this.detailedVariancesByDepartment.map(d => d.budgetedAmount);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Variance',
          data: varianceData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 2,
          borderColor: 'black',
        }, {
          label: 'Actual Amount',
          data: actualData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderWidth: 2,
          borderColor: 'black',
        }, {
          label: 'Budgeted Amount',
          data: budgetedData,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderWidth: 2,
          borderColor: 'black',
        }]
      },
      options: {
        animation: {
          duration: 0
        },
        plugins: {
          title: {
            display: true,
            text: "Business Unit Allocation for Departments",
            font: { weight: 'bold', size: 20 },
            color: 'black'
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 16,
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
        responsive: true,
        scales: {
          x: {
            title: {
              text: "Departments",
              display: true,
              font: { weight: 'bold', size: 20 },
              color: 'black'
            },
            type: 'category',
            stacked: false
          },
          y: {
            title:
            {
              text: "Business Unit Allocation Pricing (R)",
              display: true,
              font: { weight: 'bold', size: 20 },
              color: 'black'
            },
            beginAtZero: true,
            type: 'linear',
            stacked: false
          }
        }
      },
      plugins: [ChartDataLabels]
    });
    this.businessUnitAllocationChartImageBase64 = this.chart.toBase64Image();
  }

  generateBudgetVarianceReport(): void {
    var currYear = Number(sessionStorage.getItem('year'));


    this.ReportService.GetMonthlyBudgetDataForCategory(currYear).subscribe(data => {

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
        {
          text: 'For Year: ' + currYear,
          fontSize: 12,
          alignment: 'center',
          bold: true
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
            [{ text: 'Total Amount for ' + uniqueCategories[0], colSpan: 2, fillColor: '#d9e2f3' }, {}, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Category.account_Name == uniqueCategories[0]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: '', fillColor: '#d9e2f3' }],
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

      content.push(
        {
          table: {
            headerRows: 0,
            widths: [125, 96, 96, 50, 50, 60],
            body: [
              [{ text: 'Total Amount for all Categories', alignment: 'center', color: 'black', fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: '', fillColor: '#d9e2f3' }],
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


      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Budget Variance Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }

    });
  }

  initializeBarChart(): void {
    var currYear = Number(sessionStorage.getItem('year'));
    let ctxBar = this.barCanvas.nativeElement.getContext('2d');



    this.ReportService.GetYearlyTotalsForCategory(currYear).subscribe(data => {
      let categories = Object.keys(data);
      let yearlyTotals = Object.values(data);

      this.barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Yearly Totals',
            data: yearlyTotals,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderColor: 'black',
          }]
        },
        options: {
          animation: {
            duration: 0
          },
          plugins: {
            title: {
              display: true,
              text: "Total Expenses for Categories",
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
          responsive: true,
          scales: {
            x: {
              title: {
                text: "Categories",
                display: true,
                font: { weight: 'bold', size: 20 },
                color: 'black'
              },
              type: 'category',
              stacked: false
            },
            y: {
              title:
              {
                text: "Total Category Expense (R)",
                display: true,
                font: { weight: 'bold', size: 20 },
                color: 'black'
              },
              beginAtZero: true,
              type: 'linear',
              stacked: false
            }
          }
        },
        plugins: [ChartDataLabels]
      });
      this.budgetVarianceBarChartImageBase64 = this.barChart.toBase64Image();

    });

    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  initializeLineChart(): void {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var currYear = Number(sessionStorage.getItem('year'));

    let ctxLine = this.expensesChart.nativeElement.getContext('2d');


    // Call the GetMonthlyTotals function to get the monthly totals
    this.ReportService.GetMonthlyTotals(currYear).subscribe(data => {
      let dataArray = Array.isArray(data) ? data : Object.entries(data).map(([month, total]) => ({ month, total }));

      // Sort the dataArray based on the month order
      dataArray.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      let months = dataArray.map(monthData => monthData.month);
      let monthlyTotals = dataArray.map(monthData => monthData.total);
      console.log(monthlyTotals)
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
          animation: {
            duration: 0
          },
          plugins: {
            title: {
              display: true,
              text: "Monthly Expenditure Per Month",
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
          responsive: true,
          scales: {
            x: {
              title: {
                text: "Months",
                display: true,
                font: { weight: 'bold', size: 20 },
                color: 'black'
              },
              type: 'category'
            },
            y: {
              title:
              {
                text: "Monthly Expenditure Price (R)",
                display: true,
                font: { weight: 'bold', size: 20 },
                color: 'black'
              },
              beginAtZero: true,
              type: 'linear'
            }
          }

        },
        plugins: [ChartDataLabels]
      });
      this.budgetVarianceLineChartImageBase64 = this.lineChart.toBase64Image();
      //setTimeout(() => {


      //this.lineChart.destroy();
      // this.showCanvas = false;  // Hide the canvas
      //}, 500);


    });
    if (this.lineChart) {
      this.lineChart.destroy();
    }

  }

  generateConsumableManagementReport(): void {

    this.ReportService.filter$.subscribe(filter => {
      this.filter = filter;
    });
    let startDate = this.filter.startDate;
    let endDate = this.filter.endDate;
    this.ReportService.GetReportData(startDate, endDate).subscribe(data => {

      const grouped = data.consumables.map(item => {
        let monthlySums = new Array(12).fill(0);
        let monthlyCounts = new Array(12).fill(0);

        item.history.forEach(histItem => {
          const date = new Date(histItem.dateCaptured);
          const month = date.getMonth(); // JavaScript months are 0-based
          monthlySums[month] += histItem.stockAmt;
          monthlyCounts[month] += 1;
        });

        let monthlyAverages = monthlySums.map((sum, index) => {
          if (monthlyCounts[index] === 0) {
            return 0;
          }
          return sum / monthlyCounts[index];
        });

        return {
          consumable: item.consumable,
          monthlyAverages: monthlyAverages
        };
      });


      // var ReportData = data;
      var User = this.ReportService.decodeUser(sessionStorage.getItem('token'))
      // var CurrencyTransform = new CurrencyPipe('en-ZA')
      // let uniqueDepartments = data.map(p => p.budget_Allocation.department.name).filter((name, index, currentval) => currentval.indexOf(name) === index);
      let content = [
        {
          text: 'Consumable Inventory Management Report',
          fontSize: 18,
          alignment: 'center',
          color: '#244688',
          bold: true,
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
        {
          text: 'Monthly On Hand Averages For Period: ' + startDate + ' to ' + endDate,
          fontSize: 12,
          alignment: 'center',
          bold: true
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
            widths: [62, 25, 30, 20, 20, 20, 25, 25, 25, 35, 25, 34, 32],
            body: [[
              { text: 'Consumable', color: '#ffffff', fillColor: '#244688' },
              { text: 'January', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'February', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'March', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'April', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'May', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'June', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'July', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'August', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'September', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'October', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'November', alignment: 'center', color: '#ffffff', fillColor: '#244688' },
              { text: 'December', alignment: 'center', color: '#ffffff', fillColor: '#244688' }
            ],
            ...grouped.map(p => ([{ text: p.consumable.name, fillColor: '#b4c6e7' }, { text: p.monthlyAverages[0].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[1].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[2].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[3].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[4].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[5].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[6].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[7].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[8].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[9].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[10].toFixed(2), fillColor: '#b4c6e7' }, { text: p.monthlyAverages[11].toFixed(2), fillColor: '#b4c6e7' }])),
              // [{ text: 'Total Amount for ' + uniqueDepartments[0], colSpan: 2, fillColor: '#d9e2f3' }, {}, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.actualAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.budgetAmt), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }, { text: CurrencyTransform.transform(Number(ReportData.filter(x => x.budget_Allocation.department.name == uniqueDepartments[0]).reduce((sum, p) => sum + Number(p.variance), 0).toFixed(2)), 'R'), fillColor: '#d9e2f3' }],
              // [{ text: ' ', colSpan: 5, fillColor: "#244688" }, {}, {}, {}],
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

      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, alignment: 'center' }],
        // Add space above the line
        margin: [0, 10, 0, 10]
      },
        { text: '**End of Report**', fontSize: 12, alignment: 'center', bold: true })

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


      if (this.bDownload == true) {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).download("Consumable Inventory Management Report")
      }
      else {
        this.bDownload = false;
        pdfMake.createPdf(docDefinition).open();
      }

    });
  }




  bDownload = false;
  iVal = 0;
  value(ID: number) {
    this.iVal = ID;
  }

  CorrectRouting(boolValue: boolean) {
    let ID = this.iVal
    console.log(ID)
    switch (ID) {
      case 1: {
        this.bDownload = boolValue;
        this.GenerateApprovedReport()
        break;
      }

      case 2: {
        this.ViewFilter(2, boolValue)
        break;
      }

      case 3: {
        this.ViewFilter(3, boolValue)
        break;
      }

      case 4: {
        this.bDownload = boolValue;
        this.ViewFilter(4, boolValue)
        break;
      }

      case 5: {
        this.bDownload = boolValue;
        this.ViewFilter2(5, boolValue)
        break;
      }

      case 6: {
        this.bDownload = boolValue;
        this.ViewFilter2(6, boolValue)
        break;
      }
    }
  }

  ViewFilter(ID: Number, sDownload: boolean) {

    if (ID == 4) {
      this.GeneralConsumableMangementSelected = true
    }
    else {
      this.GeneralConsumableMangementSelected = false
    }


    const confirm = this.dialog.open(ReportFilterMenuComponent, {
      disableClose: true,
      data: { ID, sDownload }

    });
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
      }
    })
  }

  ViewFilter2(ID: Number, sDownload: boolean) {


    const confirm = this.dialog.open(YearPickerComponent, {
      disableClose: true,
      data: { ID, sDownload }

    });
    this.dialog.afterAllClosed.subscribe({
      next: (response) => {
      }
    })
  }


  openReportsIFrameTab(): void {
    const dialogRef = this.dialog.open(ReportsIFrameComponent, {
      panelClass: 'iframe-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any dialog close actions if needed
    });
  }

}




