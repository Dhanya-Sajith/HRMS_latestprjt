import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesstripComponent } from './businesstrip.component';

describe('BusinesstripComponent', () => {
  let component: BusinesstripComponent;
  let fixture: ComponentFixture<BusinesstripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinesstripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinesstripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
