import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestManagementComponent } from './requestmanagement.component';

describe('RequestmanagementComponent', () => {
  let component: RequestManagementComponent;
  let fixture: ComponentFixture<RequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
