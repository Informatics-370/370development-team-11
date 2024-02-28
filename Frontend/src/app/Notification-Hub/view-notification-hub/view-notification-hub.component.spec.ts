import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotificationHubComponent } from './view-notification-hub.component';

describe('ViewNotificationHubComponent', () => {
  let component: ViewNotificationHubComponent;
  let fixture: ComponentFixture<ViewNotificationHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNotificationHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNotificationHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
