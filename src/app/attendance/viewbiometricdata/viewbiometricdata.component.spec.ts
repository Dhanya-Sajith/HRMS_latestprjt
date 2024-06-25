import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbiometricdataComponent } from './viewbiometricdata.component';

describe('ViewbiometricdataComponent', () => {
  let component: ViewbiometricdataComponent;
  let fixture: ComponentFixture<ViewbiometricdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewbiometricdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewbiometricdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
