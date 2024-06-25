import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyEvaluationMgrComponent } from './competency-evaluation-mgr.component';

describe('CompetencyEvaluationMgrComponent', () => {
  let component: CompetencyEvaluationMgrComponent;
  let fixture: ComponentFixture<CompetencyEvaluationMgrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyEvaluationMgrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetencyEvaluationMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
