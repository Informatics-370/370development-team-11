import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCreateDepartmentComponent } from './dynamic-create-department.component';

describe('DynamicCreateDepartmentComponent', () => {
  let component: DynamicCreateDepartmentComponent;
  let fixture: ComponentFixture<DynamicCreateDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicCreateDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCreateDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
