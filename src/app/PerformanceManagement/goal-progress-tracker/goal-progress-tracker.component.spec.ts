import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalProgressTrackerComponent } from './goal-progress-tracker.component';

describe('GoalProgressTrackerComponent', () => {
  let component: GoalProgressTrackerComponent;
  let fixture: ComponentFixture<GoalProgressTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalProgressTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalProgressTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
