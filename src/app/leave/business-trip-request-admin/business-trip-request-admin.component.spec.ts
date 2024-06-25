import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTripRequestAdminComponent } from './business-trip-request-admin.component';

describe('BusinessTripRequestAdminComponent', () => {
  let component: BusinessTripRequestAdminComponent;
  let fixture: ComponentFixture<BusinessTripRequestAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTripRequestAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTripRequestAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
