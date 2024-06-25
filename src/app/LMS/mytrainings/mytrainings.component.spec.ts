import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytrainingsComponent } from './mytrainings.component';

describe('MytrainingsComponent', () => {
  let component: MytrainingsComponent;
  let fixture: ComponentFixture<MytrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MytrainingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MytrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
