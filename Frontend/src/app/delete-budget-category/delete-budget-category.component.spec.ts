import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBudgetCategoryComponent } from './delete-budget-category.component';

describe('DeleteBudgetCategoryComponent', () => {
  let component: DeleteBudgetCategoryComponent;
  let fixture: ComponentFixture<DeleteBudgetCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBudgetCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBudgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
