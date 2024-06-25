import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusPayoutHistoryReportComponent } from './bonus-payout-history-report.component';

describe('BonusPayoutHistoryReportComponent', () => {
  let component: BonusPayoutHistoryReportComponent;
  let fixture: ComponentFixture<BonusPayoutHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusPayoutHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusPayoutHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
