import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApproveComponent } from './vendor-approve.component';

describe('VendorApproveComponent', () => {
  let component: VendorApproveComponent;
  let fixture: ComponentFixture<VendorApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
