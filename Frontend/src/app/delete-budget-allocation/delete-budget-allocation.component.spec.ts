import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBudgetAllocationComponent } from './delete-budget-allocation.component';

describe('DeleteBudgetAllocationComponent', () => {
  let component: DeleteBudgetAllocationComponent;
  let fixture: ComponentFixture<DeleteBudgetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBudgetAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBudgetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
