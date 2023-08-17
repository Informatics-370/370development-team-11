import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateIFrameComponent } from './mandate-iframe.component';

describe('MandateIFrameComponent', () => {
  let component: MandateIFrameComponent;
  let fixture: ComponentFixture<MandateIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandateIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandateIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
