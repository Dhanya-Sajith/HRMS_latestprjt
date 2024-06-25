import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusPayrollReportComponent } from './bonus-payroll-report.component';

describe('BonusPayrollReportComponent', () => {
  let component: BonusPayrollReportComponent;
  let fixture: ComponentFixture<BonusPayrollReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusPayrollReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusPayrollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
