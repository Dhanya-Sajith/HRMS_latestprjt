import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringDashboardComponent } from './hiring-dashboard.component';

describe('HiringDashboardComponent', () => {
  let component: HiringDashboardComponent;
  let fixture: ComponentFixture<HiringDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
