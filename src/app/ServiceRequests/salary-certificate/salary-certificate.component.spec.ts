import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryCertificateComponent } from './salary-certificate.component';

describe('SalaryCertificateComponent', () => {
  let component: SalaryCertificateComponent;
  let fixture: ComponentFixture<SalaryCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
