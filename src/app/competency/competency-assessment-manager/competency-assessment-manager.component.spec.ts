import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyAssessmentManagerComponent } from './competency-assessment-manager.component';

describe('CompetencyAssessmentManagerComponent', () => {
  let component: CompetencyAssessmentManagerComponent;
  let fixture: ComponentFixture<CompetencyAssessmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyAssessmentManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetencyAssessmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
