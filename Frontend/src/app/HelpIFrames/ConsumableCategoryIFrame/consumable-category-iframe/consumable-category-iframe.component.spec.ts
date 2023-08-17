import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableCategoryIFrameComponent } from './consumable-category-iframe.component';

describe('ConsumableCategoryIFrameComponent', () => {
  let component: ConsumableCategoryIFrameComponent;
  let fixture: ComponentFixture<ConsumableCategoryIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumableCategoryIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableCategoryIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
