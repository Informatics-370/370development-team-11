import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApprovedAddDetailsComponent } from './vendor-approved-add-details.component';

describe('VendorApprovedAddDetailsComponent', () => {
  let component: VendorApprovedAddDetailsComponent;
  let fixture: ComponentFixture<VendorApprovedAddDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorApprovedAddDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorApprovedAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
