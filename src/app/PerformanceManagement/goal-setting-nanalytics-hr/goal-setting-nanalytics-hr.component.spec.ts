import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalSettingNanalyticsHRComponent } from './goal-setting-nanalytics-hr.component';

describe('GoalSettingNanalyticsHRComponent', () => {
  let component: GoalSettingNanalyticsHRComponent;
  let fixture: ComponentFixture<GoalSettingNanalyticsHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalSettingNanalyticsHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalSettingNanalyticsHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
