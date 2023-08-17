import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeProcReqIFrameComponent } from './finalize-proc-req-iframe.component';

describe('FinalizeProcReqIFrameComponent', () => {
  let component: FinalizeProcReqIFrameComponent;
  let fixture: ComponentFixture<FinalizeProcReqIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizeProcReqIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizeProcReqIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
