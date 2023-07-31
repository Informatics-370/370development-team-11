import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnapprovedRequestsComponent } from './view-unapproved-requests.component';

describe('ViewUnapprovedRequestsComponent', () => {
  let component: ViewUnapprovedRequestsComponent;
  let fixture: ComponentFixture<ViewUnapprovedRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUnapprovedRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUnapprovedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
