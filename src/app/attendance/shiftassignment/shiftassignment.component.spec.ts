import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftassignmentComponent } from './shiftassignment.component';

describe('ShiftassignmentComponent', () => {
  let component: ShiftassignmentComponent;
  let fixture: ComponentFixture<ShiftassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftassignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
