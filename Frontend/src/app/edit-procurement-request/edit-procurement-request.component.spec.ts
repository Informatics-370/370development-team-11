import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProcurementRequestComponent } from './edit-procurement-request.component';

describe('EditProcurementRequestComponent', () => {
  let component: EditProcurementRequestComponent;
  let fixture: ComponentFixture<EditProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
