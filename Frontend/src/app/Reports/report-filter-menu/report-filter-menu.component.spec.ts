import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterMenuComponent } from './report-filter-menu.component';

describe('ReportFilterMenuComponent', () => {
  let component: ReportFilterMenuComponent;
  let fixture: ComponentFixture<ReportFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFilterMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
