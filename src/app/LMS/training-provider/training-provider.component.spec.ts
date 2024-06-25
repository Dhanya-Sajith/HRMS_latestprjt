import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProviderComponent } from './training-provider.component';

describe('TrainingProviderComponent', () => {
  let component: TrainingProviderComponent;
  let fixture: ComponentFixture<TrainingProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
