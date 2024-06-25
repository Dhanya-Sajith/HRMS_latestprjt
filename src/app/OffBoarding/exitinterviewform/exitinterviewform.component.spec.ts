import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitinterviewformComponent } from './exitinterviewform.component';

describe('ExitinterviewformComponent', () => {
  let component: ExitinterviewformComponent;
  let fixture: ComponentFixture<ExitinterviewformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitinterviewformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitinterviewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
