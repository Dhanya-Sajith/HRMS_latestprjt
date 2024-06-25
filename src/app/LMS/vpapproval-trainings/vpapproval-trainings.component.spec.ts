import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VPApprovalTrainingsComponent } from './vpapproval-trainings.component';

describe('VPApprovalTrainingsComponent', () => {
  let component: VPApprovalTrainingsComponent;
  let fixture: ComponentFixture<VPApprovalTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VPApprovalTrainingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VPApprovalTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
