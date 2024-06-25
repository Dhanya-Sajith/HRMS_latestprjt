import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTransferCertificateComponent } from './salary-transfer-certificate.component';

describe('SalaryTransferCertificateComponent', () => {
  let component: SalaryTransferCertificateComponent;
  let fixture: ComponentFixture<SalaryTransferCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryTransferCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTransferCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
