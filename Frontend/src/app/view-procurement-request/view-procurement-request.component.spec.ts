import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcurementRequestComponent } from './view-procurement-request.component';

describe('ViewProcurementRequestComponent', () => {
  let component: ViewProcurementRequestComponent;
  let fixture: ComponentFixture<ViewProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
