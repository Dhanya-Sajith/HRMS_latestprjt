import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeedirectoryviewComponent } from './employeedirectoryview.component';

describe('EmployeedirectoryviewComponent', () => {
  let component: EmployeedirectoryviewComponent;
  let fixture: ComponentFixture<EmployeedirectoryviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeedirectoryviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeedirectoryviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
