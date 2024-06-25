import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseHrComponent } from './expense-hr.component';

describe('ExpenseHrComponent', () => {
  let component: ExpenseHrComponent;
  let fixture: ComponentFixture<ExpenseHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
