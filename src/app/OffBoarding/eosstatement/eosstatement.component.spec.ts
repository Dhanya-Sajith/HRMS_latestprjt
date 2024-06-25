import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EOSStatementComponent } from './eosstatement.component';

describe('EOSStatementComponent', () => {
  let component: EOSStatementComponent;
  let fixture: ComponentFixture<EOSStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EOSStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EOSStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
