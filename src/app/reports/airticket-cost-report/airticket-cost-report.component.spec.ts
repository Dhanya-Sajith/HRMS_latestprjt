import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirticketCostReportComponent } from './airticket-cost-report.component';

describe('AirticketCostReportComponent', () => {
  let component: AirticketCostReportComponent;
  let fixture: ComponentFixture<AirticketCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirticketCostReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirticketCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
