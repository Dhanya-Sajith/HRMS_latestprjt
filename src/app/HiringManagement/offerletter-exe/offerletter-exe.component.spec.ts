import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferletterExeComponent } from './offerletter-exe.component';

describe('OfferletterExeComponent', () => {
  let component: OfferletterExeComponent;
  let fixture: ComponentFixture<OfferletterExeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferletterExeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferletterExeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
