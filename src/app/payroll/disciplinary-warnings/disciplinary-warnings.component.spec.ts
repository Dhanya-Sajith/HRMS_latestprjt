import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinaryWarningsComponent } from './disciplinary-warnings.component';

describe('DisciplinaryWarningsComponent', () => {
  let component: DisciplinaryWarningsComponent;
  let fixture: ComponentFixture<DisciplinaryWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplinaryWarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinaryWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
