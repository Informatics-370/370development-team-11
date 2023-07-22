import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApproveEditComponent } from './vendor-approve-edit.component';

describe('VendorApproveEditComponent', () => {
  let component: VendorApproveEditComponent;
  let fixture: ComponentFixture<VendorApproveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorApproveEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorApproveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
