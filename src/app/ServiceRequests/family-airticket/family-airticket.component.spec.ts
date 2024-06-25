import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAirticketComponent } from './family-airticket.component';

describe('FamilyAirticketComponent', () => {
  let component: FamilyAirticketComponent;
  let fixture: ComponentFixture<FamilyAirticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyAirticketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyAirticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
