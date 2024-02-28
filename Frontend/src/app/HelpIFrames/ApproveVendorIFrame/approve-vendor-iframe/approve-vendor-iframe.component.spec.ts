import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveVendorIFrameComponent } from './approve-vendor-iframe.component';

describe('ApproveVendorIFrameComponent', () => {
  let component: ApproveVendorIFrameComponent;
  let fixture: ComponentFixture<ApproveVendorIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveVendorIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveVendorIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
