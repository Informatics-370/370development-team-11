import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPayementFileComponent } from './upload-payement-file.component';

describe('UploadPayementFileComponent', () => {
  let component: UploadPayementFileComponent;
  let fixture: ComponentFixture<UploadPayementFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPayementFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPayementFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
