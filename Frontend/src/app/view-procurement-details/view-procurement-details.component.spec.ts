import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcurementDetailsComponent } from './view-procurement-details.component';

describe('ViewProcurementDetailsComponent', () => {
  let component: ViewProcurementDetailsComponent;
  let fixture: ComponentFixture<ViewProcurementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProcurementDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProcurementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
