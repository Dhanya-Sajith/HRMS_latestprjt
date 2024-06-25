import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEffectivenessFeedbackComponent } from './course-effectiveness-feedback.component';

describe('CourseEffectivenessFeedbackComponent', () => {
  let component: CourseEffectivenessFeedbackComponent;
  let fixture: ComponentFixture<CourseEffectivenessFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEffectivenessFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEffectivenessFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
