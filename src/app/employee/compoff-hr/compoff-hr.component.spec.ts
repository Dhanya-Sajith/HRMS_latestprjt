import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoffHrComponent } from './compoff-hr.component';

describe('CompoffHrComponent', () => {
  let component: CompoffHrComponent;
  let fixture: ComponentFixture<CompoffHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompoffHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompoffHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
