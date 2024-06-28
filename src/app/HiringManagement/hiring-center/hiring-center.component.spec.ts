import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringCenterComponent } from './hiring-center.component';

describe('HiringCenterComponent', () => {
  let component: HiringCenterComponent;
  let fixture: ComponentFixture<HiringCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
