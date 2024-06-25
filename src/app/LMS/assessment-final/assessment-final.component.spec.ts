import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentFinalComponent } from './assessment-final.component';

describe('AssessmentFinalComponent', () => {
  let component: AssessmentFinalComponent;
  let fixture: ComponentFixture<AssessmentFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
