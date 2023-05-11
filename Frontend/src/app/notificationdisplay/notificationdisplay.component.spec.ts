import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationdisplayComponent } from './notificationdisplay.component';

describe('NotificationdisplayComponent', () => {
  let component: NotificationdisplayComponent;
  let fixture: ComponentFixture<NotificationdisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
