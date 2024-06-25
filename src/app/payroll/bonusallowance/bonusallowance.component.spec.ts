import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusallowanceComponent } from './bonusallowance.component';

describe('BonusallowanceComponent', () => {
  let component: BonusallowanceComponent;
  let fixture: ComponentFixture<BonusallowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusallowanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusallowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
