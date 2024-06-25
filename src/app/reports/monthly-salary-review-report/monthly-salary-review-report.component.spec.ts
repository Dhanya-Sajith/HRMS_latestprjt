import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalaryReviewReportComponent } from './monthly-salary-review-report.component';

describe('MonthlySalaryReviewReportComponent', () => {
  let component: MonthlySalaryReviewReportComponent;
  let fixture: ComponentFixture<MonthlySalaryReviewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlySalaryReviewReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlySalaryReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
