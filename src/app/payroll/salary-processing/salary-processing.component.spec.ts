import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryProcessingComponent } from './salary-processing.component';

describe('SalaryProcessingComponent', () => {
  let component: SalaryProcessingComponent;
  let fixture: ComponentFixture<SalaryProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryProcessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
