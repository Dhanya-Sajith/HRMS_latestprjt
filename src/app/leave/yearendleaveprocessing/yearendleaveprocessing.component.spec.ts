import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearendleaveprocessingComponent } from './yearendleaveprocessing.component';

describe('YearendleaveprocessingComponent', () => {
  let component: YearendleaveprocessingComponent;
  let fixture: ComponentFixture<YearendleaveprocessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearendleaveprocessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearendleaveprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
