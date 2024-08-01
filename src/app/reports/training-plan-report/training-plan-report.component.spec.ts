import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlanReportComponent } from './training-plan-report.component';

describe('TrainingPlanReportComponent', () => {
  let component: TrainingPlanReportComponent;
  let fixture: ComponentFixture<TrainingPlanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingPlanReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPlanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
