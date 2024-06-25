import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovelevelsettingComponent } from './approvelevelsetting.component';

describe('ApprovelevelsettingComponent', () => {
  let component: ApprovelevelsettingComponent;
  let fixture: ComponentFixture<ApprovelevelsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovelevelsettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovelevelsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
