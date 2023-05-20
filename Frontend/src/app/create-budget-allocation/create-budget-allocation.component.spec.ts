import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetAllocationComponent } from './create-budget-allocation.component';

describe('CreateBudgetAllocationComponent', () => {
  let component: CreateBudgetAllocationComponent;
  let fixture: ComponentFixture<CreateBudgetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBudgetAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBudgetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
