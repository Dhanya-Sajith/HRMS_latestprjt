import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EosReportComponent } from './eos-report.component';

describe('EosReportComponent', () => {
  let component: EosReportComponent;
  let fixture: ComponentFixture<EosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EosReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
