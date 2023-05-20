import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMandateLimitComponent } from './delete-mandate-limit.component';

describe('DeleteMandateLimitComponent', () => {
  let component: DeleteMandateLimitComponent;
  let fixture: ComponentFixture<DeleteMandateLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMandateLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMandateLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
