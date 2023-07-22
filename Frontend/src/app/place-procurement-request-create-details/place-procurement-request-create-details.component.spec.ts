import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceProcurementRequestCreateDetailsComponent } from './place-procurement-request-create-details.component';

describe('PlaceProcurementRequestCreateDetailsComponent', () => {
  let component: PlaceProcurementRequestCreateDetailsComponent;
  let fixture: ComponentFixture<PlaceProcurementRequestCreateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceProcurementRequestCreateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceProcurementRequestCreateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
