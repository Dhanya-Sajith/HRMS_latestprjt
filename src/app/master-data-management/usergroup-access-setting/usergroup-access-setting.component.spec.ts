import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupAccessSettingComponent } from './usergroup-access-setting.component';

describe('UsergroupAccessSettingComponent', () => {
  let component: UsergroupAccessSettingComponent;
  let fixture: ComponentFixture<UsergroupAccessSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsergroupAccessSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergroupAccessSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
