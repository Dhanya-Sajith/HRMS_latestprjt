import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularizationHRComponent } from './regularization-hr.component';

describe('RegularizationHrComponent', () => {
  let component: RegularizationHRComponent;
  let fixture: ComponentFixture<RegularizationHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularizationHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularizationHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
