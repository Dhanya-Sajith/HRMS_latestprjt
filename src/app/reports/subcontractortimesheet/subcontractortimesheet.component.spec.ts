import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractortimesheetComponent } from './subcontractortimesheet.component';

describe('SubcontractortimesheetComponent', () => {
  let component: SubcontractortimesheetComponent;
  let fixture: ComponentFixture<SubcontractortimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcontractortimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcontractortimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
