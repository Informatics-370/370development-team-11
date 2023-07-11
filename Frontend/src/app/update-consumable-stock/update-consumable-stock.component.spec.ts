import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConsumableStockComponent } from './update-consumable-stock.component';

describe('UpdateConsumableStockComponent', () => {
  let component: UpdateConsumableStockComponent;
  let fixture: ComponentFixture<UpdateConsumableStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConsumableStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateConsumableStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
