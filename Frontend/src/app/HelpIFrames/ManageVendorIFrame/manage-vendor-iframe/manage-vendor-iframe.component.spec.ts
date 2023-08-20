import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVendorIFrameComponent } from './manage-vendor-iframe.component';

describe('ManageVendorIFrameComponent', () => {
  let component: ManageVendorIFrameComponent;
  let fixture: ComponentFixture<ManageVendorIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVendorIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVendorIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
