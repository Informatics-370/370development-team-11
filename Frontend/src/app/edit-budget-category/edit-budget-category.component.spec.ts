import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetCategoryComponent } from './edit-budget-category.component';

describe('EditBudgetCategoryComponent', () => {
  let component: EditBudgetCategoryComponent;
  let fixture: ComponentFixture<EditBudgetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBudgetCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBudgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
