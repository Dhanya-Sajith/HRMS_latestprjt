import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentCertificateComponent } from './employment-certificate.component';

describe('EmploymentCertificateComponent', () => {
  let component: EmploymentCertificateComponent;
  let fixture: ComponentFixture<EmploymentCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploymentCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
