import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetVarianceReportComponent } from './budget-variance-report.component';

describe('BudgetVarianceReportComponent', () => {
  let component: BudgetVarianceReportComponent;
  let fixture: ComponentFixture<BudgetVarianceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetVarianceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetVarianceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
