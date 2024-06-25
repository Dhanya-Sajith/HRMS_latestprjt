import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReportingManagerComponent } from './change-reporting-manager.component';

describe('ChangeReportingManagerComponent', () => {
  let component: ChangeReportingManagerComponent;
  let fixture: ComponentFixture<ChangeReportingManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeReportingManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeReportingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
