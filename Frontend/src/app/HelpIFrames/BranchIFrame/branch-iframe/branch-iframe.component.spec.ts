import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchIFrameComponent } from './branch-iframe.component';

describe('BranchIFrameComponent', () => {
  let component: BranchIFrameComponent;
  let fixture: ComponentFixture<BranchIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
