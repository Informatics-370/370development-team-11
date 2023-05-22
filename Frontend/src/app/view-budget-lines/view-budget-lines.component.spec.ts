import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetLinesComponent } from './view-budget-lines.component';

describe('ViewBudgetLinesComponent', () => {
  let component: ViewBudgetLinesComponent;
  let fixture: ComponentFixture<ViewBudgetLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBudgetLinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBudgetLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
