import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIFrameComponent } from './employee-iframe.component';

describe('EmployeeIFrameComponent', () => {
  let component: EmployeeIFrameComponent;
  let fixture: ComponentFixture<EmployeeIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
