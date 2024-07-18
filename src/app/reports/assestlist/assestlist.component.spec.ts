import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestlistComponent } from './assestlist.component';

describe('AssestlistComponent', () => {
  let component: AssestlistComponent;
  let fixture: ComponentFixture<AssestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssestlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
