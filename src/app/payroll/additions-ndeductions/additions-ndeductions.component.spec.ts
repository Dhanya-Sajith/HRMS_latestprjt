import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionsNdeductionsComponent } from './additions-ndeductions.component';

describe('AdditionsNdeductionsComponent', () => {
  let component: AdditionsNdeductionsComponent;
  let fixture: ComponentFixture<AdditionsNdeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionsNdeductionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionsNdeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
