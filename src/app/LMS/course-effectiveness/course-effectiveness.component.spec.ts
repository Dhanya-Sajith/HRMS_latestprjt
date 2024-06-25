import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEffectivenessComponent } from './course-effectiveness.component';

describe('CourseEffectivenessComponent', () => {
  let component: CourseEffectivenessComponent;
  let fixture: ComponentFixture<CourseEffectivenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEffectivenessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEffectivenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
