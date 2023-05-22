import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetAllocationComponent } from './edit-budget-allocation.component';

describe('EditBudgetAllocationComponent', () => {
  let component: EditBudgetAllocationComponent;
  let fixture: ComponentFixture<EditBudgetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBudgetAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBudgetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
