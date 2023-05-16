import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreateChoiceComponent } from './vendor-create-choice.component';

describe('VendorCreateChoiceComponent', () => {
  let component: VendorCreateChoiceComponent;
  let fixture: ComponentFixture<VendorCreateChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCreateChoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCreateChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
