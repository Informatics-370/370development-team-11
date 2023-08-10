import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuditLogComponent } from './view-audit-log.component';

describe('ViewAuditLogComponent', () => {
  let component: ViewAuditLogComponent;
  let fixture: ComponentFixture<ViewAuditLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAuditLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
