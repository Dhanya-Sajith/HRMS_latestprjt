import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsandsheetsComponent } from './reportsandsheets.component';

describe('ReportsandsheetsComponent', () => {
  let component: ReportsandsheetsComponent;
  let fixture: ComponentFixture<ReportsandsheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsandsheetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsandsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
