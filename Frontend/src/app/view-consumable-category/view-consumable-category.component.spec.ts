import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsumableCategoryComponent } from './view-consumable-category.component';

describe('ViewConsumableCategoryComponent', () => {
  let component: ViewConsumableCategoryComponent;
  let fixture: ComponentFixture<ViewConsumableCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsumableCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConsumableCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
