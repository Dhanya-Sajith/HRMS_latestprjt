import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePaymentComponent } from './generate-payment.component';

describe('GeneratePaymentComponent', () => {
  let component: GeneratePaymentComponent;
  let fixture: ComponentFixture<GeneratePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
