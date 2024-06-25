import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HRPoliciesComponent } from './hrpolicies.component';

describe('HRPoliciesComponent', () => {
  let component: HRPoliciesComponent;
  let fixture: ComponentFixture<HRPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HRPoliciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HRPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
