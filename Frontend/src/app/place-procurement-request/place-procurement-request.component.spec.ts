import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceProcurementRequestComponent } from './place-procurement-request.component';

describe('PlaceProcurementRequestComponent', () => {
  let component: PlaceProcurementRequestComponent;
  let fixture: ComponentFixture<PlaceProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
