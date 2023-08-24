import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBaPickerComponent } from './export-ba-picker.component';

describe('ExportBaPickerComponent', () => {
  let component: ExportBaPickerComponent;
  let fixture: ComponentFixture<ExportBaPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportBaPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportBaPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
