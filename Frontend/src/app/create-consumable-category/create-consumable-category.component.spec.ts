import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsumableCategoryComponent } from './create-consumable-category.component';

describe('CreateConsumableCategoryComponent', () => {
  let component: CreateConsumableCategoryComponent;
  let fixture: ComponentFixture<CreateConsumableCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConsumableCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConsumableCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
