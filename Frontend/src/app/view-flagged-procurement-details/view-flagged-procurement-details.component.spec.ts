import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlaggedProcurementDetailsComponent } from './view-flagged-procurement-details.component';

describe('ViewFlaggedProcurementDetailsComponent', () => {
  let component: ViewFlaggedProcurementDetailsComponent;
  let fixture: ComponentFixture<ViewFlaggedProcurementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFlaggedProcurementDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlaggedProcurementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
