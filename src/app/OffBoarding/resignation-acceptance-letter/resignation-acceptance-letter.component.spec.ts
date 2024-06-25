import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationAcceptanceLetterComponent } from './resignation-acceptance-letter.component';

describe('ResignationAcceptanceLetterComponent', () => {
  let component: ResignationAcceptanceLetterComponent;
  let fixture: ComponentFixture<ResignationAcceptanceLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResignationAcceptanceLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationAcceptanceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
