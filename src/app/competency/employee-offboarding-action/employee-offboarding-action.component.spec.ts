import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOffboardingActionComponent } from './employee-offboarding-action.component';

describe('EmployeeOffboardingActionComponent', () => {
  let component: EmployeeOffboardingActionComponent;
  let fixture: ComponentFixture<EmployeeOffboardingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOffboardingActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeOffboardingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
