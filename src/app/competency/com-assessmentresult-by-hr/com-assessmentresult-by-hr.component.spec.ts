import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComAssessmentresultByHRComponent } from './com-assessmentresult-by-hr.component';

describe('ComAssessmentresultByHRComponent', () => {
  let component: ComAssessmentresultByHRComponent;
  let fixture: ComponentFixture<ComAssessmentresultByHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComAssessmentresultByHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComAssessmentresultByHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
