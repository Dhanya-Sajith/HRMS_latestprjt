import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFeedbackFormComponent } from './course-feedback-form.component';

describe('CourseFeedbackFormComponent', () => {
  let component: CourseFeedbackFormComponent;
  let fixture: ComponentFixture<CourseFeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseFeedbackFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
