import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPRDetailsExpandedComponent } from './view-prdetails-expanded.component';

describe('ViewPRDetailsExpandedComponent', () => {
  let component: ViewPRDetailsExpandedComponent;
  let fixture: ComponentFixture<ViewPRDetailsExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPRDetailsExpandedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPRDetailsExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
