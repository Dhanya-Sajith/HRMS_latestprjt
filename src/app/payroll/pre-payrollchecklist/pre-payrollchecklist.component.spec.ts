import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePayrollchecklistComponent } from './pre-payrollchecklist.component';

describe('PrePayrollchecklistComponent', () => {
  let component: PrePayrollchecklistComponent;
  let fixture: ComponentFixture<PrePayrollchecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePayrollchecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrePayrollchecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
