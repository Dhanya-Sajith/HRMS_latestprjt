import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingStatusReportComponent } from './training-status-report.component';

describe('TrainingStatusReportComponent', () => {
  let component: TrainingStatusReportComponent;
  let fixture: ComponentFixture<TrainingStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
