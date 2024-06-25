import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceregularizationHrComponent } from './attendanceregularization-hr.component';

describe('AttendanceregularizationHrComponent', () => {
  let component: AttendanceregularizationHrComponent;
  let fixture: ComponentFixture<AttendanceregularizationHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceregularizationHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceregularizationHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
