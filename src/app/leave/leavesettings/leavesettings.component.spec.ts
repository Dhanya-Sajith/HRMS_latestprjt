import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesettingsComponent } from './leavesettings.component';

describe('LeavesettingsComponent', () => {
  let component: LeavesettingsComponent;
  let fixture: ComponentFixture<LeavesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
