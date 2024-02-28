import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleIFrameComponent } from './role-iframe.component';

describe('RoleIFrameComponent', () => {
  let component: RoleIFrameComponent;
  let fixture: ComponentFixture<RoleIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
