import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlylateCheckinCheckoutreportComponent } from './earlylate-checkin-checkoutreport.component';

describe('EarlylateCheckinCheckoutreportComponent', () => {
  let component: EarlylateCheckinCheckoutreportComponent;
  let fixture: ComponentFixture<EarlylateCheckinCheckoutreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlylateCheckinCheckoutreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarlylateCheckinCheckoutreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
