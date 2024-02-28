import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHelpComponent } from './delete-help.component';

describe('DeleteHelpComponent', () => {
  let component: DeleteHelpComponent;
  let fixture: ComponentFixture<DeleteHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
