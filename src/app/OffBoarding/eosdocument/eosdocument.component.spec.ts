import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EOSDocumentComponent } from './eosdocument.component';

describe('EOSDocumentComponent', () => {
  let component: EOSDocumentComponent;
  let fixture: ComponentFixture<EOSDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EOSDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EOSDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
