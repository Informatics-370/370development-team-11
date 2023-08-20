import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardRequestIFrameComponent } from './onboard-request-iframe.component';

describe('OnboardRequestIFrameComponent', () => {
  let component: OnboardRequestIFrameComponent;
  let fixture: ComponentFixture<OnboardRequestIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardRequestIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardRequestIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
