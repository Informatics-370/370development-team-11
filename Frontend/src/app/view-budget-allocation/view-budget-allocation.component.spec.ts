import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetAllocationComponent } from './view-budget-allocation.component';

describe('ViewBudgetAllocationComponent', () => {
  let component: ViewBudgetAllocationComponent;
  let fixture: ComponentFixture<ViewBudgetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBudgetAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBudgetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
