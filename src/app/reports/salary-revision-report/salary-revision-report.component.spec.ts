import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRevisionReportComponent } from './salary-revision-report.component';

describe('SalaryRevisionReportComponent', () => {
  let component: SalaryRevisionReportComponent;
  let fixture: ComponentFixture<SalaryRevisionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryRevisionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryRevisionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
