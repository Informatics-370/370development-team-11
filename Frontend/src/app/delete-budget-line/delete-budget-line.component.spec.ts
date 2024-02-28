import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBudgetLineComponent } from './delete-budget-line.component';

describe('DeleteBudgetLineComponent', () => {
  let component: DeleteBudgetLineComponent;
  let fixture: ComponentFixture<DeleteBudgetLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBudgetLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBudgetLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
