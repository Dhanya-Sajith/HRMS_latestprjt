import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysettingsComponent } from './holidaysettings.component';

describe('HolidaysettingsComponent', () => {
  let component: HolidaysettingsComponent;
  let fixture: ComponentFixture<HolidaysettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaysettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidaysettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
