import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDelegationComponent } from './delete-delegation.component';

describe('DeleteDelegationComponent', () => {
  let component: DeleteDelegationComponent;
  let fixture: ComponentFixture<DeleteDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
