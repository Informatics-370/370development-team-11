import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcurementRequestApprovalComponent } from './view-procurement-request-approval.component';

describe('ViewProcurementRequestApprovalComponent', () => {
  let component: ViewProcurementRequestApprovalComponent;
  let fixture: ComponentFixture<ViewProcurementRequestApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProcurementRequestApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProcurementRequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
