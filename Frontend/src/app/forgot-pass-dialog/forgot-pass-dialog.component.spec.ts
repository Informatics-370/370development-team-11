import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassDialogComponent } from './forgot-pass-dialog.component';

describe('ForgotPassDialogComponent', () => {
  let component: ForgotPassDialogComponent;
  let fixture: ComponentFixture<ForgotPassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPassDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
