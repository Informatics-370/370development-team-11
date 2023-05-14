import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendordetailsViewComponent } from './vendordetails-view.component';

describe('VendordetailsViewComponent', () => {
  let component: VendordetailsViewComponent;
  let fixture: ComponentFixture<VendordetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendordetailsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendordetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
