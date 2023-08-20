import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcReqPendingIFrameComponent } from './proc-req-pending-iframe.component';

describe('ProcReqPendingIFrameComponent', () => {
  let component: ProcReqPendingIFrameComponent;
  let fixture: ComponentFixture<ProcReqPendingIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcReqPendingIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcReqPendingIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
