import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConsumableComponent } from './delete-consumable.component';

describe('DeleteConsumableComponent', () => {
  let component: DeleteConsumableComponent;
  let fixture: ComponentFixture<DeleteConsumableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConsumableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
