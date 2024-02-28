import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogIFrameComponent } from './audit-log-iframe.component';

describe('AuditLogIFrameComponent', () => {
  let component: AuditLogIFrameComponent;
  let fixture: ComponentFixture<AuditLogIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditLogIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
