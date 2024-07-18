import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInsuranceReportComponent } from './employee-insurance-report.component';

describe('EmployeeInsuranceReportComponent', () => {
  let component: EmployeeInsuranceReportComponent;
  let fixture: ComponentFixture<EmployeeInsuranceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInsuranceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeInsuranceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
