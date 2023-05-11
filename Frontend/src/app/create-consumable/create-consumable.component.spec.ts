import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsumableComponent } from './create-consumable.component';

describe('CreateConsumableComponent', () => {
  let component: CreateConsumableComponent;
  let fixture: ComponentFixture<CreateConsumableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConsumableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
