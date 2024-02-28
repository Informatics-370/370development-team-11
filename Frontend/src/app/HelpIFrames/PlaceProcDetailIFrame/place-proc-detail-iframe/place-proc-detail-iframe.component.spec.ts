import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceProcDetailIFrameComponent } from './place-proc-detail-iframe.component';

describe('PlaceProcDetailIFrameComponent', () => {
  let component: PlaceProcDetailIFrameComponent;
  let fixture: ComponentFixture<PlaceProcDetailIFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceProcDetailIFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceProcDetailIFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
