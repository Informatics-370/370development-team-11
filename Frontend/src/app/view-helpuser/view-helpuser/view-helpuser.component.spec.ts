import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHelpuserComponent } from './view-helpuser.component';

describe('ViewHelpuserComponent', () => {
  let component: ViewHelpuserComponent;
  let fixture: ComponentFixture<ViewHelpuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHelpuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHelpuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
