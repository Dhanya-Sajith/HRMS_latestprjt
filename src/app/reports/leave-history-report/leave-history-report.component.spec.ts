import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveHistoryReportComponent } from './leave-history-report.component';

describe('LeaveHistoryReportComponent', () => {
  let component: LeaveHistoryReportComponent;
  let fixture: ComponentFixture<LeaveHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
