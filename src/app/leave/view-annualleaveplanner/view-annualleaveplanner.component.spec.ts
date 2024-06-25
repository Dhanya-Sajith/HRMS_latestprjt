import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnualleaveplannerComponent } from './view-annualleaveplanner.component';

describe('ViewAnnualleaveplannerComponent', () => {
  let component: ViewAnnualleaveplannerComponent;
  let fixture: ComponentFixture<ViewAnnualleaveplannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAnnualleaveplannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAnnualleaveplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
