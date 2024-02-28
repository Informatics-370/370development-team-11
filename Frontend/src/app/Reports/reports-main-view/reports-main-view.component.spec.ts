import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsMainViewComponent } from './reports-main-view.component';

describe('ReportsMainViewComponent', () => {
  let component: ReportsMainViewComponent;
  let fixture: ComponentFixture<ReportsMainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsMainViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
