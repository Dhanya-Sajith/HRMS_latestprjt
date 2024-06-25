import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualleaveplannerComponent } from './annualleaveplanner.component';

describe('AnnualleaveplannerComponent', () => {
  let component: AnnualleaveplannerComponent;
  let fixture: ComponentFixture<AnnualleaveplannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualleaveplannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualleaveplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
