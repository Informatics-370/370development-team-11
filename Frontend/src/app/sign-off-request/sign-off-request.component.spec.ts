import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOffRequestComponent } from './sign-off-request.component';

describe('SignOffRequestComponent', () => {
  let component: SignOffRequestComponent;
  let fixture: ComponentFixture<SignOffRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignOffRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOffRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
