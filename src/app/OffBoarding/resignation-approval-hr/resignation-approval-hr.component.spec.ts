import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationApprovalHRComponent } from './resignation-approval-hr.component';

describe('ResignationApprovalHRComponent', () => {
  let component: ResignationApprovalHRComponent;
  let fixture: ComponentFixture<ResignationApprovalHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResignationApprovalHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationApprovalHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
