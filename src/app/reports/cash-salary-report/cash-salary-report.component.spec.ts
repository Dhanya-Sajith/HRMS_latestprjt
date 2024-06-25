import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashSalaryReportComponent } from './cash-salary-report.component';

describe('CashSalaryReportComponent', () => {
  let component: CashSalaryReportComponent;
  let fixture: ComponentFixture<CashSalaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashSalaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashSalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
