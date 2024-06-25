import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProfileLimitededitComponent } from './emp-profile-limitededit.component';

describe('EmpProfileLimitededitComponent', () => {
  let component: EmpProfileLimitededitComponent;
  let fixture: ComponentFixture<EmpProfileLimitededitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpProfileLimitededitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpProfileLimitededitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
