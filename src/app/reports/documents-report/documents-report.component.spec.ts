import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsReportComponent } from './documents-report.component';


describe('DocumentsReportComponent', () => {
  let component: DocumentsReportComponent;
  let fixture: ComponentFixture<DocumentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
