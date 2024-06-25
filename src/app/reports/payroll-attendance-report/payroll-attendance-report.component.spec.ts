import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAttendanceReportComponent } from './payroll-attendance-report.component';

describe('PayrollAttendanceReportComponent', () => {
  let component: PayrollAttendanceReportComponent;
  let fixture: ComponentFixture<PayrollAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollAttendanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
