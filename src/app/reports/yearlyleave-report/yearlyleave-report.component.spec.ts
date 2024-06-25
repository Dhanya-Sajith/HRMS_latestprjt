import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyleaveReportComponent } from './yearlyleave-report.component';

describe('YearlyleaveReportComponent', () => {
  let component: YearlyleaveReportComponent;
  let fixture: ComponentFixture<YearlyleaveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyleaveReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyleaveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
