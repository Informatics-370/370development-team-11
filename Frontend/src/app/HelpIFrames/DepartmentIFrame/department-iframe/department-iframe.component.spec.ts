import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentIFrameComponent } from './department-iframe.component';

describe('DepartmentIFrameComponent', () => {
  let component: DepartmentIFrameComponent;
  let fixture: ComponentFixture<DepartmentIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
