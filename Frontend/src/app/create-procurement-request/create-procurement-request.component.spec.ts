import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProcurementRequestComponent } from './create-procurement-request.component';

describe('CreateProcurementRequestComponent', () => {
  let component: CreateProcurementRequestComponent;
  let fixture: ComponentFixture<CreateProcurementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProcurementRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProcurementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
