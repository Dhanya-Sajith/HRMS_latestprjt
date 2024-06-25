import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeprofileviewComponent } from './employeeprofileview.component';

describe('EmployeeprofileviewComponent', () => {
  let component: EmployeeprofileviewComponent;
  let fixture: ComponentFixture<EmployeeprofileviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeprofileviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeprofileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
