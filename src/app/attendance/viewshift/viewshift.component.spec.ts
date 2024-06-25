import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewshiftComponent } from './viewshift.component';

describe('ViewshiftComponent', () => {
  let component: ViewshiftComponent;
  let fixture: ComponentFixture<ViewshiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewshiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
