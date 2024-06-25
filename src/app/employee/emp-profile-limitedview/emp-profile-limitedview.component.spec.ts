import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProfileLimitedviewComponent } from './emp-profile-limitedview.component';

describe('EmpProfileLimitedviewComponent', () => {
  let component: EmpProfileLimitedviewComponent;
  let fixture: ComponentFixture<EmpProfileLimitedviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpProfileLimitedviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpProfileLimitedviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
