import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeProcurementRequestComponent } from './finalize-procurement-request.component';

describe('FinalizeProcurementRequestComponent', () => {
  let component: FinalizeProcurementRequestComponent;
  let fixture: ComponentFixture<FinalizeProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizeProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizeProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
