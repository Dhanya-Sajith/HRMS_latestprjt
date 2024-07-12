import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRevisionHistoryReportComponent } from './salary-revision-history-report.component';

describe('SalaryRevisionHistoryReportComponent', () => {
  let component: SalaryRevisionHistoryReportComponent;
  let fixture: ComponentFixture<SalaryRevisionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryRevisionHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryRevisionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
