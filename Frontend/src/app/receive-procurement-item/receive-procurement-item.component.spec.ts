import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveProcurementItemComponent } from './receive-procurement-item.component';

describe('ReceiveProcurementItemComponent', () => {
  let component: ReceiveProcurementItemComponent;
  let fixture: ComponentFixture<ReceiveProcurementItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveProcurementItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveProcurementItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
