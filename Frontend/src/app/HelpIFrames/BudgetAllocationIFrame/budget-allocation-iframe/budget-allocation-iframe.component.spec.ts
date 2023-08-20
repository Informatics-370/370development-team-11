import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAllocationIFrameComponent } from './budget-allocation-iframe.component';

describe('BudgetAllocationIFrameComponent', () => {
  let component: BudgetAllocationIFrameComponent;
  let fixture: ComponentFixture<BudgetAllocationIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAllocationIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetAllocationIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
