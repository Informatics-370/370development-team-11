import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMandateLimitComponent } from './edit-mandate-limit.component';

describe('EditMandateLimitComponent', () => {
  let component: EditMandateLimitComponent;
  let fixture: ComponentFixture<EditMandateLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMandateLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMandateLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
