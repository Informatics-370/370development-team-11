import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationIFrameComponent } from './delegation-iframe.component';

describe('DelegationIFrameComponent', () => {
  let component: DelegationIFrameComponent;
  let fixture: ComponentFixture<DelegationIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
