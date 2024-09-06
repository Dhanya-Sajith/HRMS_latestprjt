import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanHRComponent } from './loan-hr.component';

describe('LoanHrComponent', () => {
  let component: LoanHRComponent;
  let fixture: ComponentFixture<LoanHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
