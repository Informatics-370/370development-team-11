import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMandateLimitComponent } from './view-mandate-limit.component';

describe('ViewMandateLimitComponent', () => {
  let component: ViewMandateLimitComponent;
  let fixture: ComponentFixture<ViewMandateLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMandateLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMandateLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
