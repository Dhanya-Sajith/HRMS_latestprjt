import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirticketBookingComponent } from './airticket-booking.component';

describe('AirticketBookingComponent', () => {
  let component: AirticketBookingComponent;
  let fixture: ComponentFixture<AirticketBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirticketBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirticketBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
