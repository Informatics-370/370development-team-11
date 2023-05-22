import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetLineComponent } from './create-budget-line.component';

describe('CreateBudgetLineComponent', () => {
  let component: CreateBudgetLineComponent;
  let fixture: ComponentFixture<CreateBudgetLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBudgetLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBudgetLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
