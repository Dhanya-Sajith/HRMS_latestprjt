import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancefinalizationComponent } from './attendancefinalization.component';

describe('AttendancefinalizationComponent', () => {
  let component: AttendancefinalizationComponent;
  let fixture: ComponentFixture<AttendancefinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancefinalizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancefinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
