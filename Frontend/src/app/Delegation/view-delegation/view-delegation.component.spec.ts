import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDelegationComponent } from './view-delegation.component';

describe('ViewDelegationComponent', () => {
  let component: ViewDelegationComponent;
  let fixture: ComponentFixture<ViewDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
