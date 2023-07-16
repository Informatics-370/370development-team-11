import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDelegationComponent } from './edit-delegation.component';

describe('EditDelegationComponent', () => {
  let component: EditDelegationComponent;
  let fixture: ComponentFixture<EditDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
