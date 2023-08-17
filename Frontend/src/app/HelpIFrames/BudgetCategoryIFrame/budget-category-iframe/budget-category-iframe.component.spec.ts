import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryIFrameComponent } from './budget-category-iframe.component';

describe('BudgetCategoryIFrameComponent', () => {
  let component: BudgetCategoryIFrameComponent;
  let fixture: ComponentFixture<BudgetCategoryIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetCategoryIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
