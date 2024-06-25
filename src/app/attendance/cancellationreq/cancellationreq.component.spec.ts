import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationreqComponent } from './cancellationreq.component';

describe('CancellationreqComponent', () => {
  let component: CancellationreqComponent;
  let fixture: ComponentFixture<CancellationreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancellationreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
