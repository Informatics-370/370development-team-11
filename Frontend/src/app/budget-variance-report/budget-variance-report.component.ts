import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../DataService/data-service';
import { Chart } from 'chart.js'
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { BudgetCategory } from '../Shared/BudgetCategory';

@Component({
  selector: 'app-budget-variance-report',
  templateUrl: './budget-variance-report.component.html',
  styleUrls: ['./budget-variance-report.component.css']
})
export class BudgetVarianceReportComponent implements OnInit {
  detailedVariancesByDepartment: {
    department: string,
    variance: number,
    actualAmount: number,
    budgetedAmount: number
  }[] = [];
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
  @Input() data: {
    department: string,
    variance: number,
    actualAmount: number,
    budgetedAmount: number
  }[] = [];

  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  chart: any;



  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.GetBudgetLines().subscribe(data => {
      const groupedData = data.reduce((acc, line) => {
        let departmentName = line.budget_Allocation.department.name;
        let group = acc.find(g => g.department === departmentName);
        if (!group) {
          group = { department: departmentName, lines: [] };
          acc.push(group);
        }
        group.lines.push(line);
        return acc;
      }, []);

      this.groupedBudgetLines = groupedData;
    });

    this.dataService.GetVarianceByDepartment().subscribe(data => {
      this.detailedVariancesByDepartment = Object.keys(data).map(key => {
        return {
          department: key,
          variance: data[key].item1,
          actualAmount: data[key].item2,
          budgetedAmount: data[key].item3
        };
      });
      this.initializeChart();
    });
  }
  // ngAfterViewInit(): void {
  //   this.initializeChart();
  // }

  initializeChart(): void {
    let ctx = this.chartCanvas.nativeElement.getContext('2d');
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
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }, {
          label: 'Actual Amount',
          data: actualData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }, {
          label: 'Budgeted Amount',
          data: budgetedData,
          backgroundColor: 'rgba(255, 206, 86, 0.5)'
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
  }
  getTotalActualAmount(lines: any[]): number {
    return lines.reduce((sum, line) => sum + line.actualAmt, 0);
  }

  getTotalBudgetedAmount(lines: any[]): number {
    return lines.reduce((sum, line) => sum + line.budgetAmt, 0); // Adjust the property name if different
  }

  getTotalVariance(lines: any[]): number {
    return lines.reduce((sum, line) => sum + (line.budgetAmt - line.actualAmt), 0); // Adjust the property names if different
  }

}
