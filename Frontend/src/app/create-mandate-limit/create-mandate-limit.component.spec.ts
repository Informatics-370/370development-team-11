import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMandateLimitComponent } from './create-mandate-limit.component';

describe('CreateMandateLimitComponent', () => {
  let component: CreateMandateLimitComponent;
  let fixture: ComponentFixture<CreateMandateLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMandateLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMandateLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
