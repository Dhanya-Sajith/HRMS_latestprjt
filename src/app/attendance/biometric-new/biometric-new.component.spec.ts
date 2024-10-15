import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricNewComponent } from './biometric-new.component';

describe('BiometricNewComponent', () => {
  let component: BiometricNewComponent;
  let fixture: ComponentFixture<BiometricNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometricNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiometricNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
