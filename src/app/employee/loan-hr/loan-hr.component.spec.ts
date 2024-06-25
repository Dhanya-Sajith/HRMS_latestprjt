import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanHrComponent } from './loan-hr.component';

describe('LoanHrComponent', () => {
  let component: LoanHrComponent;
  let fixture: ComponentFixture<LoanHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
