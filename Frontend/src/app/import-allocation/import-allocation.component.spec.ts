import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAllocationComponent } from './import-allocation.component';

describe('ImportAllocationComponent', () => {
  let component: ImportAllocationComponent;
  let fixture: ComponentFixture<ImportAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAllocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
