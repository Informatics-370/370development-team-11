import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIFrameComponent } from './admin-iframe.component';

describe('AdminIFrameComponent', () => {
  let component: AdminIFrameComponent;
  let fixture: ComponentFixture<AdminIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
