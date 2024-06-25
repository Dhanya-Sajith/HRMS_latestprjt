import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationByHRComponent } from './evaluation-by-hr.component';

describe('EvaluationByHRComponent', () => {
  let component: EvaluationByHRComponent;
  let fixture: ComponentFixture<EvaluationByHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationByHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationByHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
