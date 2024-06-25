import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripRequestComponent } from './business-trip-request.component';

describe('BusinessTripRequestComponent', () => {
  let component: BusinessTripRequestComponent;
  let fixture: ComponentFixture<BusinessTripRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTripRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTripRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
