import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProcurementRequestComponent } from './delete-procurement-request.component';

describe('DeleteProcurementRequestComponent', () => {
  let component: DeleteProcurementRequestComponent;
  let fixture: ComponentFixture<DeleteProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
