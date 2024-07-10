import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferletterIntComponent } from './offerletter-int.component';

describe('OfferletterIntComponent', () => {
  let component: OfferletterIntComponent;
  let fixture: ComponentFixture<OfferletterIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferletterIntComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferletterIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
