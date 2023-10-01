import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProcurementRequestPage } from './create-procurement-request.page';

describe('CreateProcurementRequestPage', () => {
  let component: CreateProcurementRequestPage;
  let fixture: ComponentFixture<CreateProcurementRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateProcurementRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
