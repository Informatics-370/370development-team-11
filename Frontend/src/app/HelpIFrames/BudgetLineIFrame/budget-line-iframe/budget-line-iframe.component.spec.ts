import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetLineIFrameComponent } from './budget-line-iframe.component';

describe('BudgetLineIFrameComponent', () => {
  let component: BudgetLineIFrameComponent;
  let fixture: ComponentFixture<BudgetLineIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetLineIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetLineIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
