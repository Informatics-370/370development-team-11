import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetLineComponent } from './edit-budget-line.component';

describe('EditBudgetLineComponent', () => {
  let component: EditBudgetLineComponent;
  let fixture: ComponentFixture<EditBudgetLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBudgetLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBudgetLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
