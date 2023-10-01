import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProcurementRequestPage } from './edit-procurement-request.page';

describe('EditProcurementRequestPage', () => {
  let component: EditProcurementRequestPage;
  let fixture: ComponentFixture<EditProcurementRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditProcurementRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
