import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoffComponent } from './compoff.component';

describe('CompoffComponent', () => {
  let component: CompoffComponent;
  let fixture: ComponentFixture<CompoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
