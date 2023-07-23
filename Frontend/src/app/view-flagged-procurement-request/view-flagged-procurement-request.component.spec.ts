import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlaggedProcurementRequestComponent } from './view-flagged-procurement-request.component';

describe('ViewFlaggedProcurementRequestComponent', () => {
  let component: ViewFlaggedProcurementRequestComponent;
  let fixture: ComponentFixture<ViewFlaggedProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFlaggedProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlaggedProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
