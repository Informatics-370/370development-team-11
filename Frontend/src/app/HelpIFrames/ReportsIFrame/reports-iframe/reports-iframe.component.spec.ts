import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsIFrameComponent } from './reports-iframe.component';

describe('ReportsIFrameComponent', () => {
  let component: ReportsIFrameComponent;
  let fixture: ComponentFixture<ReportsIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
