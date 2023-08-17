import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableIFrameComponent } from './consumable-iframe.component';

describe('ConsumableIFrameComponent', () => {
  let component: ConsumableIFrameComponent;
  let fixture: ComponentFixture<ConsumableIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumableIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
