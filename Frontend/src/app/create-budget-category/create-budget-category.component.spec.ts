import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetCategoryComponent } from './create-budget-category.component';

describe('CreateBudgetCategoryComponent', () => {
  let component: CreateBudgetCategoryComponent;
  let fixture: ComponentFixture<CreateBudgetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBudgetCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBudgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
