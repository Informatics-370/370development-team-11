import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcReqIFrameComponent } from './proc-req-iframe.component';

describe('ProcReqIFrameComponent', () => {
  let component: ProcReqIFrameComponent;
  let fixture: ComponentFixture<ProcReqIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcReqIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcReqIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
