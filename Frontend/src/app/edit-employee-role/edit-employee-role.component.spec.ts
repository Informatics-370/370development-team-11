import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeRoleComponent } from './edit-employee-role.component';

describe('EditEmployeeRoleComponent', () => {
  let component: EditEmployeeRoleComponent;
  let fixture: ComponentFixture<EditEmployeeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
