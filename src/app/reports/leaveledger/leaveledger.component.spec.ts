import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveledgerComponent } from './leaveledger.component';

describe('LeaveledgerComponent', () => {
  let component: LeaveledgerComponent;
  let fixture: ComponentFixture<LeaveledgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveledgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
