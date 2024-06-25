import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceLogReportComponent } from './grievance-log-report.component';

describe('GrievanceLogReportComponent', () => {
  let component: GrievanceLogReportComponent;
  let fixture: ComponentFixture<GrievanceLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceLogReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
