import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSkillMatrixComponent } from './emp-skill-matrix.component';

describe('EmpSkillMatrixComponent', () => {
  let component: EmpSkillMatrixComponent;
  let fixture: ComponentFixture<EmpSkillMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpSkillMatrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpSkillMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
