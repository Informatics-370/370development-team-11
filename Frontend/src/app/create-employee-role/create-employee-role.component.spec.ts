import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeRoleComponent } from './create-employee-role.component';

describe('CreateEmployeeRoleComponent', () => {
  let component: CreateEmployeeRoleComponent;
  let fixture: ComponentFixture<CreateEmployeeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
