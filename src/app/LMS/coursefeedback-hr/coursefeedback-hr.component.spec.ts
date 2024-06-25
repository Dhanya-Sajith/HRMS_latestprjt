import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursefeedbackHRComponent } from './coursefeedback-hr.component';

describe('CoursefeedbackHRComponent', () => {
  let component: CoursefeedbackHRComponent;
  let fixture: ComponentFixture<CoursefeedbackHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursefeedbackHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursefeedbackHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
