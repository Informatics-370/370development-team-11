import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConsumableCategoryComponent } from './delete-consumable-category.component';

describe('DeleteConsumableCategoryComponent', () => {
  let component: DeleteConsumableCategoryComponent;
  let fixture: ComponentFixture<DeleteConsumableCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConsumableCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConsumableCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
