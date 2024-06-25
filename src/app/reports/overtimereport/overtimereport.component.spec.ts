import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimereportComponent } from './overtimereport.component';

describe('OvertimereportComponent', () => {
  let component: OvertimereportComponent;
  let fixture: ComponentFixture<OvertimereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
