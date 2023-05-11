import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeRoleComponent } from './view-employee-role.component';

describe('ViewEmployeeRoleComponent', () => {
  let component: ViewEmployeeRoleComponent;
  let fixture: ComponentFixture<ViewEmployeeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeeRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
