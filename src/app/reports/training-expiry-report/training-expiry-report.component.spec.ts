import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingExpiryReportComponent } from './training-expiry-report.component';

describe('TrainingExpiryReportComponent', () => {
  let component: TrainingExpiryReportComponent;
  let fixture: ComponentFixture<TrainingExpiryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingExpiryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingExpiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
