import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalaryReportComponent } from './edit-salary-report.component';

describe('EditSalaryReportComponent', () => {
  let component: EditSalaryReportComponent;
  let fixture: ComponentFixture<EditSalaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSalaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
