import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDelegationComponent } from './reject-delegation.component';

describe('RejectDelegationComponent', () => {
  let component: RejectDelegationComponent;
  let fixture: ComponentFixture<RejectDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
