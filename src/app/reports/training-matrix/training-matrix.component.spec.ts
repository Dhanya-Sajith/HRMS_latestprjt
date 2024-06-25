import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMatrixComponent } from './training-matrix.component';

describe('TrainingMatrixComponent', () => {
  let component: TrainingMatrixComponent;
  let fixture: ComponentFixture<TrainingMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMatrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
