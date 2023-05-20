import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetCategoryComponent } from './view-budget-category.component';

describe('ViewBudgetCategoryComponent', () => {
  let component: ViewBudgetCategoryComponent;
  let fixture: ComponentFixture<ViewBudgetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBudgetCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBudgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
