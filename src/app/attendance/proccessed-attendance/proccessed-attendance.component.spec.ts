import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccessedAttendanceComponent } from './proccessed-attendance.component';

describe('ProccessedAttendanceComponent', () => {
  let component: ProccessedAttendanceComponent;
  let fixture: ComponentFixture<ProccessedAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProccessedAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProccessedAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
