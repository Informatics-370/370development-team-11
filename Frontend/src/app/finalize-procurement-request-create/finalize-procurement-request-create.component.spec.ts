import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeProcurementRequestCreateComponent } from './finalize-procurement-request-create.component';

describe('FinalizeProcurementRequestCreateComponent', () => {
  let component: FinalizeProcurementRequestCreateComponent;
  let fixture: ComponentFixture<FinalizeProcurementRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizeProcurementRequestCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizeProcurementRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
