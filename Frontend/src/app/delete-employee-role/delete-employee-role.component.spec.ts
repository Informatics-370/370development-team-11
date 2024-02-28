import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployeeRoleComponent } from './delete-employee-role.component';

describe('DeleteEmployeeRoleComponent', () => {
  let component: DeleteEmployeeRoleComponent;
  let fixture: ComponentFixture<DeleteEmployeeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEmployeeRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
