import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsumableComponent } from './view-consumable.component';

describe('ViewConsumableComponent', () => {
  let component: ViewConsumableComponent;
  let fixture: ComponentFixture<ViewConsumableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsumableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
