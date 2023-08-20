import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaggerProcDetailIFrameComponent } from './flagger-proc-detail-iframe.component';

describe('FlaggerProcDetailIFrameComponent', () => {
  let component: FlaggerProcDetailIFrameComponent;
  let fixture: ComponentFixture<FlaggerProcDetailIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlaggerProcDetailIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlaggerProcDetailIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
