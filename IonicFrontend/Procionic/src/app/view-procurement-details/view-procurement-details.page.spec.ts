import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProcurementDetailsPage } from './view-procurement-details.page';

describe('ViewProcurementDetailsPage', () => {
  let component: ViewProcurementDetailsPage;
  let fixture: ComponentFixture<ViewProcurementDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewProcurementDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
