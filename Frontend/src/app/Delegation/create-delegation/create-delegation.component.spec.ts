import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDelegationComponent } from './create-delegation.component';

describe('CreateDelegationComponent', () => {
  let component: CreateDelegationComponent;
  let fixture: ComponentFixture<CreateDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
