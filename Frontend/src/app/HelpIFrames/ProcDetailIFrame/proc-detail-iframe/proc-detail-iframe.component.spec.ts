import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcDetailIFrameComponent } from './proc-detail-iframe.component';

describe('ProcDetailIFrameComponent', () => {
  let component: ProcDetailIFrameComponent;
  let fixture: ComponentFixture<ProcDetailIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcDetailIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcDetailIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
