import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEffectivenessfeedbackHrComponent } from './course-effectivenessfeedback-hr.component';

describe('CourseEffectivenessfeedbackHrComponent', () => {
  let component: CourseEffectivenessfeedbackHrComponent;
  let fixture: ComponentFixture<CourseEffectivenessfeedbackHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEffectivenessfeedbackHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEffectivenessfeedbackHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
