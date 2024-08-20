import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveHRComponent } from './leave-hr.component';

describe('LeaveHrComponent', () => {
  let component: LeaveHRComponent;
  let fixture: ComponentFixture<LeaveHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
