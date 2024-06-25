import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditemployeeprofileComponent } from './editemployeeprofile.component';

describe('EditemployeeprofileComponent', () => {
  let component: EditemployeeprofileComponent;
  let fixture: ComponentFixture<EditemployeeprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditemployeeprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditemployeeprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
