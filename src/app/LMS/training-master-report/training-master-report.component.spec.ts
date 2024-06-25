import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMasterReportComponent } from './training-master-report.component';

describe('TrainingMasterReportComponent', () => {
  let component: TrainingMasterReportComponent;
  let fixture: ComponentFixture<TrainingMasterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMasterReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
