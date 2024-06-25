import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsHrComponent } from './permissions-hr.component';

describe('PermissionsHrComponent', () => {
  let component: PermissionsHrComponent;
  let fixture: ComponentFixture<PermissionsHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionsHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
