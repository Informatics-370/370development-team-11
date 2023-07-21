import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPendingProcurementRequestComponent } from './view-pending-procurement-request.component';

describe('ViewPendingProcurementRequestComponent', () => {
  let component: ViewPendingProcurementRequestComponent;
  let fixture: ComponentFixture<ViewPendingProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPendingProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPendingProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
