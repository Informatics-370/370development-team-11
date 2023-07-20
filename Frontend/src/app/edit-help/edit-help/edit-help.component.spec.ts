import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHelpComponent } from './edit-help.component';

describe('EditHelpComponent', () => {
  let component: EditHelpComponent;
  let fixture: ComponentFixture<EditHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
