import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProcurementRequestPage } from './view-procurement-request.page';

describe('ViewProcurementRequestPage', () => {
  let component: ViewProcurementRequestPage;
  let fixture: ComponentFixture<ViewProcurementRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewProcurementRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
