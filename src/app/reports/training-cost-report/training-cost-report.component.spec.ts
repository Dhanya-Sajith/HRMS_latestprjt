import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCostReportComponent } from './training-cost-report.component';

describe('TrainingCostReportComponent', () => {
  let component: TrainingCostReportComponent;
  let fixture: ComponentFixture<TrainingCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCostReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
