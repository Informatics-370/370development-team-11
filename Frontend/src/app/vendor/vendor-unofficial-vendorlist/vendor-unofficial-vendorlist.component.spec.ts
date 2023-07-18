import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorUnofficialVendorlistComponent } from './vendor-unofficial-vendorlist.component';

describe('VendorUnofficialVendorlistComponent', () => {
  let component: VendorUnofficialVendorlistComponent;
  let fixture: ComponentFixture<VendorUnofficialVendorlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorUnofficialVendorlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorUnofficialVendorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
