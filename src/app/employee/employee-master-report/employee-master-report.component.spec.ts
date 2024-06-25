import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterReportComponent } from './employee-master-report.component';

describe('EmployeeMasterReportComponent', () => {
  let component: EmployeeMasterReportComponent;
  let fixture: ComponentFixture<EmployeeMasterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMasterReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
