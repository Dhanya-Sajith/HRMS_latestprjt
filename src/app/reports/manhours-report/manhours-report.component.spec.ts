import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManhoursReportComponent } from './manhours-report.component';

describe('ManhoursReportComponent', () => {
  let component: ManhoursReportComponent;
  let fixture: ComponentFixture<ManhoursReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManhoursReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManhoursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
