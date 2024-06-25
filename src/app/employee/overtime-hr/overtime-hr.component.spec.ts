import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Overtime_HRComponent } from './overtime-hr.component';

describe('OvertimeHRComponent', () => {
  let component: Overtime_HRComponent;
  let fixture: ComponentFixture<Overtime_HRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Overtime_HRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Overtime_HRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
