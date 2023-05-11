import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsumableCategoryComponent } from './edit-consumable-category.component';

describe('EditConsumableCategoryComponent', () => {
  let component: EditConsumableCategoryComponent;
  let fixture: ComponentFixture<EditConsumableCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsumableCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConsumableCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
