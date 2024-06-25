import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BustripHrComponent } from './bustrip-hr.component';

describe('BustripHrComponent', () => {
  let component: BustripHrComponent;
  let fixture: ComponentFixture<BustripHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BustripHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BustripHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
